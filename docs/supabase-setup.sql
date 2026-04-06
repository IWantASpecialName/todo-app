-- =====================================================
-- 待办事项应用 - Supabase 数据库设置
-- =====================================================
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本
-- =====================================================

-- 1. 创建 todos 表
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 stats 表
CREATE TABLE IF NOT EXISTS stats (
  id TEXT DEFAULT 'default' PRIMARY KEY,
  total_completed INTEGER DEFAULT 0 NOT NULL,
  today_completed INTEGER DEFAULT 0 NOT NULL,
  today_date TEXT,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  last_completed_date TEXT,
  achievements TEXT[] DEFAULT '{}' NOT NULL
);

-- 3. 初始化 stats 数据
INSERT INTO stats (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- 4. 开启行级安全策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- 5. todos 表安全策略
DROP POLICY IF EXISTS "允许公开读取todos" ON todos;
CREATE POLICY "允许公开读取todos" ON todos FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许公开插入todos" ON todos;
CREATE POLICY "允许公开插入todos" ON todos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "允许公开更新todos" ON todos;
CREATE POLICY "允许公开更新todos" ON todos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "允许公开删除todos" ON todos;
CREATE POLICY "允许公开删除todos" ON todos FOR DELETE USING (true);

-- 6. stats 表安全策略
DROP POLICY IF EXISTS "允许公开读取stats" ON stats;
CREATE POLICY "允许公开读取stats" ON stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许公开更新stats" ON stats;
CREATE POLICY "允许公开更新stats" ON stats FOR UPDATE USING (true);

-- =====================================================
-- 执行完成！现在可以部署到 Vercel
-- =====================================================
