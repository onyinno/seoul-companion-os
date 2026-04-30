-- Seoul itinerary content patch (2026-04)
--
-- Why this patch exists:
-- Existing logged-in users read itinerary content from Supabase `public.itinerary_activities`.
-- Seed updates in `lib/seed.ts` only affect fresh/local data (or new migrations),
-- and do NOT automatically overwrite already-migrated cloud rows.
--
-- Usage:
-- 1) Review each UPDATE below.
-- 2) Run manually in Supabase SQL Editor with a normal authenticated project role.
-- 3) Verify updated rows in Trip + Budget views.
--
-- Safety notes:
-- - Updates only specific known activity IDs whose seeded content changed.
-- - Preserves row IDs and does not delete/reset rows.
-- - Does NOT touch `user_id`, `created_at`, `photo_storage_path`,
--   `photo_file_name`, `photo_uploaded_at`, or schema.

begin;

-- Day 1 arrival-day buffer
update public.itinerary_activities set time = '19:00', note = '7 Donggyo-ro 46-gil, Mapo-gu；預留入境、行李、交通同入住緩衝後再食晚餐。', cost = 22000 where id = 'a-1-2';
update public.itinerary_activities set time = '20:30' where id = 'a-1-3';
update public.itinerary_activities set time = '21:50' where id = 'a-1-4';
update public.itinerary_activities set time = '22:40', note = '如果仲有精神可行去 Yeonnam 一帶，否則直接返酒店休息；保持到埗日輕鬆節奏。' where id = 'a-1-5';

-- Budget estimate updates (Day 2/3)
update public.itinerary_activities set cost = 12000 where id = 'a-2-1';
update public.itinerary_activities set cost = 9000 where id = 'a-2-2';
update public.itinerary_activities set cost = 26000 where id = 'a-2-4';
update public.itinerary_activities set cost = 12000 where id = 'a-2-5';
update public.itinerary_activities set cost = 18000 where id = 'a-2-6';
update public.itinerary_activities set cost = 15000 where id = 'a-3-1';
update public.itinerary_activities set cost = 25000 where id = 'a-3-3';

-- Day 4 Geumdwaeji buffer + budget updates
update public.itinerary_activities set time = '15:50', cost = 12000 where id = 'a-4-2';
update public.itinerary_activities set time = '16:20', note = '提前出發，目標約17:00到 Yaksu 一帶；地鐵到 Yaksu Station 2號出口。', cost = 3000 where id = 'a-4-3';
update public.itinerary_activities set note = '核心晚餐時段要保護：如隊伍較長，彈性等位並壓縮後段散步。', cost = 42000 where id = 'a-4-4';
update public.itinerary_activities set time = '19:45' where id = 'a-4-5';

-- Day 5 N Seoul Tower decision-rule notes + budget updates
update public.itinerary_activities set note = '集中行最有氣氛嘅河段，黃昏時間最佳；若18:30後先離開清溪川，今晚可跳過 N Seoul Tower。' where id = 'a-5-2';
update public.itinerary_activities set note = '若18:30前可離開清溪川就繼續上山；否則改做 Myeongdong / Euljiro / Hongdae 輕鬆夜行。乘 01A/01B 南山循環巴士；必要時可改乘的士。', cost = 3000 where id = 'a-5-3';
update public.itinerary_activities set note = '安排夜景時段到訪（按上段時間判斷是否執行）。', cost = 21000 where id = 'a-5-4';
update public.itinerary_activities set cost = 10000 where id = 'a-5-5';

-- Budget estimate updates (Day 6/7)
update public.itinerary_activities set cost = 11000 where id = 'a-6-2';
update public.itinerary_activities set cost = 35000 where id = 'a-6-3';
update public.itinerary_activities set note = 'H-Cube 4F, 140 Yanghwa-ro；近 Hongik Univ. Station 9號出口。按實際療程計。' where id = 'a-7-1';
update public.itinerary_activities set cost = 10000 where id = 'a-7-2';
update public.itinerary_activities set cost = 23000 where id = 'a-7-3';
update public.itinerary_activities set cost = 10000 where id = 'a-7-5';

-- Day 8 airport buffer + budget updates
update public.itinerary_activities set time = '09:15', note = '去機場前留喺附近，唔好走太遠；用餐後預留時間返酒店取行李與退房。', cost = 15000 where id = 'a-8-1';
update public.itinerary_activities set time = '11:10', note = '建議11:00–11:15離開酒店區；優先機場交通，唔好再加額外購物。由 Hongik Univ. Station 乘機場線前往。', cost = 5000 where id = 'a-8-2';

commit;
