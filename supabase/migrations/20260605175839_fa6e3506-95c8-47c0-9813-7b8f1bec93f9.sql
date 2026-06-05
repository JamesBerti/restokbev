
-- 1. Hide ldb_floor from public/authenticated reads (server admin still has access)
REVOKE SELECT (ldb_floor) ON public.products FROM anon, authenticated;

-- 2. Realtime channel authorization
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "restok_realtime_read" ON realtime.messages;
CREATE POLICY "restok_realtime_read"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (
  -- Public marketplace product feed
  realtime.topic() = 'products-live'
  OR (
    auth.uid() IS NOT NULL AND (
      -- Licensee's own order feed: my-orders-{uid}
      realtime.topic() = 'my-orders-' || auth.uid()::text
      -- Retailer order feed: retailer-orders-{retailer_uuid}
      OR (
        realtime.topic() LIKE 'retailer-orders-%'
        AND public.is_approved_retailer(
          auth.uid(),
          NULLIF(substring(realtime.topic() from 'retailer-orders-(.*)'), '')::uuid
        )
      )
      -- Retailer product feed: retailer-{retailer_uuid}
      OR (
        realtime.topic() LIKE 'retailer-%'
        AND realtime.topic() NOT LIKE 'retailer-orders-%'
        AND public.is_approved_retailer(
          auth.uid(),
          NULLIF(substring(realtime.topic() from 'retailer-(.*)'), '')::uuid
        )
      )
    )
  )
);
