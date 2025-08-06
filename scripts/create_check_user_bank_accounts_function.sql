-- Create function to check if a user has bank accounts
-- This function bypasses RLS to allow checking other users' account status for transfers

CREATE OR REPLACE FUNCTION check_user_bank_accounts(user_id_param UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  bank_name TEXT,
  account_name TEXT,
  account_number TEXT,
  account_type TEXT,
  balance DECIMAL(15,2),
  currency TEXT,
  is_primary BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ba.id,
    ba.user_id,
    ba.bank_name,
    ba.account_name,
    ba.account_number,
    ba.account_type,
    ba.balance,
    ba.currency,
    ba.is_primary,
    ba.created_at,
    ba.updated_at
  FROM bank_accounts ba
  WHERE ba.user_id = user_id_param;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_user_bank_accounts(UUID) TO authenticated;

-- Add comment to document the function
COMMENT ON FUNCTION check_user_bank_accounts(UUID) IS 'Check if a user has bank accounts - used for transfer validation. Bypasses RLS for system operations.';
