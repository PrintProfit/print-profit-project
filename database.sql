-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

-- database name is "print_profit"

DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "company";
DROP TABLE IF EXISTS "pending_user_company";
DROP TABLE IF EXISTS "quote";
DROP TABLE IF EXISTS "product";
DROP TABLE IF EXISTS "cost";

CREATE TABLE "company" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100) UNIQUE NOT NULL,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT NOT NULL
);

CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY,
	"email" VARCHAR(100) UNIQUE NOT NULL,
	"name" VARCHAR(200),
	"company_id" INT REFERENCES "company" NOT NULL,
	"password" VARCHAR(100) NOT NULL,
	"is_admin" BOOLEAN DEFAULT FALSE,
	"is_company_admin" BOOLEAN DEFAULT FALSE,
	"is_removed" BOOLEAN DEFAULT FALSE,
	"is_approved" BOOLEAN DEFAULT FALSE,
	"last_login" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT NOT NULL
);

CREATE TABLE "pending_user_company" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" NOT NULL,
	"name" VARCHAR(100),
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT NOT NULL
);

CREATE TABLE "quote" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" NOT NULL,
	"name" VARCHAR(100),
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT NOT NULL
);

CREATE TABLE "product" (
	"id" SERIAL PRIMARY KEY,
	"quote_id" INT REFERENCES "quote" NOT NULL,
	"name" VARCHAR(100),
	"quantity" INT,
	"selling_price_per_unit" FLOAT(8) DEFAULT NULL,
	"total_selling_price" FLOAT(8) DEFAULT NULL,
	"estimated_hours" INT,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT NOT NULL
);

CREATE TABLE "cost" (
	"id" SERIAL PRIMARY KEY,
	"product_id" INT REFERENCES "product" NOT NULL,
	"name" VARCHAR(100),
	"value" FLOAT(8) NOT NULL,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT NOT NULL
);

SET TIMEZONE = 'America/Chicago'; 
