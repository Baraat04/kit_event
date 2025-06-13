-- Добавляем поле для отслеживания последнего входа
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Создаем индекс для быстрого поиска по времени последнего входа
CREATE INDEX IF NOT EXISTS idx_participant_last_login ON participants(last_login);
