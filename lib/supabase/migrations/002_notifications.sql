-- ============================================================================
-- Migration 002: Sistema de Notificações
-- ============================================================================

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    action_url TEXT,
    action_label VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT notifications_type_check CHECK (
        type IN (
            'course_assigned',
            'course_deadline_approaching',
            'course_deadline_passed',
            'course_completed',
            'certificate_available',
            'new_content',
            'quiz_available',
            'quiz_result',
            'welcome',
            'system',
            'organization_update'
        )
    )
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Tabela de Preferências de Notificação
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(20) DEFAULT 'immediate',
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT notification_preferences_frequency_check CHECK (
        frequency IN ('immediate', 'daily', 'weekly', 'never')
    )
);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

CREATE TRIGGER trigger_update_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- RLS Policies para Notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas suas próprias notificações
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias notificações
CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Sistema pode criar notificações (via service role)
CREATE POLICY "System can create notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

-- RLS Policies para Preferências de Notificação
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas suas próprias preferências
CREATE POLICY "Users can view their own notification preferences"
    ON public.notification_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias preferências
CREATE POLICY "Users can update their own notification preferences"
    ON public.notification_preferences
    FOR ALL
    USING (auth.uid() = user_id);

-- Função para criar notificação (pode ser chamada via service role)
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR(50),
    p_title VARCHAR(255),
    p_message TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_action_url TEXT DEFAULT NULL,
    p_action_label VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        metadata,
        action_url,
        action_label
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_metadata,
        p_action_url,
        p_action_label
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.notifications
    SET read = TRUE, updated_at = NOW()
    WHERE id = p_notification_id AND user_id = p_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar todas as notificações como lidas
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.notifications
    SET read = TRUE, updated_at = NOW()
    WHERE user_id = p_user_id AND read = FALSE;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON TABLE public.notifications IS 'Sistema de notificações in-app para usuários';
COMMENT ON TABLE public.notification_preferences IS 'Preferências de notificação por usuário';
COMMENT ON FUNCTION create_notification IS 'Cria uma nova notificação para um usuário';
COMMENT ON FUNCTION mark_notification_read IS 'Marca uma notificação específica como lida';
COMMENT ON FUNCTION mark_all_notifications_read IS 'Marca todas as notificações de um usuário como lidas';

