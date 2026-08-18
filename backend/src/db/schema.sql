-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- AI Resume Roasts
CREATE TABLE IF NOT EXISTS roasts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) DEFAULT 'Anonymous Resume',
    target_role VARCHAR(255) DEFAULT 'General Candidate',
    intensity VARCHAR(50) DEFAULT 'spicy',
    input_type VARCHAR(50) DEFAULT 'text',
    raw_text TEXT,

    savage_roast TEXT NOT NULL,
    one_liner VARCHAR(500),

    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    buzzword_score INTEGER CHECK (buzzword_score >= 0 AND buzzword_score <= 100),
    design_score INTEGER CHECK (design_score >= 0 AND design_score <= 100),
    credibility_score INTEGER CHECK (credibility_score >= 0 AND credibility_score <= 100),

    red_flags JSONB DEFAULT '[]'::jsonb,
    bullet_rewrites JSONB DEFAULT '[]'::jsonb,
    actionable_tips JSONB DEFAULT '[]'::jsonb,
    rewritten_summary TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roasts_user_id ON roasts (user_id);
CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON roasts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roasts_intensity ON roasts (intensity);