-- Создание таблицы участников
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  participant_number INTEGER UNIQUE NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  position VARCHAR(200) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  color_group VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индекса для быстрого поиска по номеру участника
CREATE INDEX IF NOT EXISTS idx_participant_number ON participants(participant_number);

-- Создание индекса для быстрого поиска по логину
CREATE INDEX IF NOT EXISTS idx_participant_login ON participants(login);
