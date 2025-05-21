create extension if not exists vector;

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_taste_points INT DEFAULT 0;
	health_flags TEXT[];
);

CREATE TABLE Products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    image_embedding VECTOR(1536),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generic_name VARCHAR(255),
    ingredients TEXT,
    categories TEXT[],
    brands TEXT[]
);

CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_count INT DEFAULT 0
);

CREATE TABLE History (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE User_Badges (
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,,
    badge_id INT NOT NULL REFERENCES Badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
);
