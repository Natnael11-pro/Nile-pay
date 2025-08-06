-- Add account_name column to bank_accounts table
-- This allows users to give custom names to their bank accounts

-- Add the account_name column
ALTER TABLE bank_accounts 
ADD COLUMN account_name VARCHAR(100) NOT NULL DEFAULT 'My Account';

-- Update existing records with default names based on bank and account type
UPDATE bank_accounts 
SET account_name = CONCAT(bank_name, ' ', INITCAP(account_type), ' Account')
WHERE account_name = 'My Account';

-- Add index for better performance when searching by account name
CREATE INDEX idx_bank_accounts_account_name ON bank_accounts(account_name);

-- Add comment to document the column
COMMENT ON COLUMN bank_accounts.account_name IS 'User-defined custom name for the bank account (e.g., "My Savings Account", "Business Account")';
