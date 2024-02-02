-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

-- database name is "print_profit"
DROP TRIGGER IF EXISTS "on_user_update" ON "user";
DROP TRIGGER IF EXISTS "on_company_update" ON "company";
DROP TRIGGER IF EXISTS "on_pending_user_company_update" ON "pending_user_company";
DROP TRIGGER IF EXISTS "on_quote_update" ON "quote";
DROP TRIGGER IF EXISTS "on_product_update" ON "product";
DROP TRIGGER IF EXISTS "on_cost_update" ON "cost";
DROP FUNCTION IF EXISTS "set_updated_at_to_now";
DROP TABLE IF EXISTS "pending_user_company";
DROP TABLE IF EXISTS "cost";
DROP TABLE IF EXISTS "product";
DROP TABLE IF EXISTS "quote";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "company";


CREATE TABLE "company" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100) UNIQUE NOT NULL,
	"is_removed" BOOLEAN DEFAULT FALSE,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT
);

CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY,
	"email" VARCHAR(100) UNIQUE NOT NULL,
	"name" VARCHAR(200),
	"company_id" INT REFERENCES "company" ON DELETE CASCADE DEFAULT NULL,
	"password" VARCHAR(100) NOT NULL,
	"is_admin" BOOLEAN DEFAULT FALSE,
	"is_company_admin" BOOLEAN DEFAULT FALSE,
	"is_removed" BOOLEAN DEFAULT FALSE,
	"is_approved" BOOLEAN DEFAULT FALSE,
	"last_login" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT
);

CREATE TABLE "pending_user_company" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" ON DELETE CASCADE NOT NULL,
	"name" VARCHAR(100) DEFAULT NULL,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT
);

CREATE TABLE "quote" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" ON DELETE CASCADE NOT NULL,
	"name" VARCHAR(100),
	"manual_total_selling_price" FLOAT(8) DEFAULT NULL,
	"manual_contribution_percent" INT DEFAULT NULL,
	"is_removed" BOOLEAN DEFAULT FALSE,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT 
);

CREATE TABLE "product" (
	"id" SERIAL PRIMARY KEY,
	"quote_id" INT REFERENCES "quote" ON DELETE CASCADE NOT NULL,
	"name" VARCHAR(100),
	"quantity" INT,
	"selling_price_per_unit" FLOAT(8) DEFAULT NULL,
	"total_selling_price" FLOAT(8) DEFAULT NULL,
	"estimated_hours" INT,
	"is_removed" BOOLEAN DEFAULT FALSE,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT 
);

CREATE TABLE "cost" (
	"id" SERIAL PRIMARY KEY,
	"product_id" INT REFERENCES "product" ON DELETE CASCADE NOT NULL,
	"name" VARCHAR(100),
	"value" FLOAT(8) NOT NULL,
	"is_removed" BOOLEAN DEFAULT FALSE,
	"inserted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	"updated_by" INT 
);

CREATE FUNCTION set_updated_at_to_now()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_update
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_company_update
BEFORE UPDATE ON "company"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_pending_user_company_update
BEFORE UPDATE ON "pending_user_company"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_quote_update
BEFORE UPDATE ON "quote"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_product_update
BEFORE UPDATE ON "product"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

CREATE TRIGGER on_cost_update
BEFORE UPDATE ON "cost"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

SET TIMEZONE = 'America/Chicago'; 
