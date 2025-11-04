-- جدول الداعمين
CREATE TABLE IF NOT EXISTS public.supporters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  message TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- فهرسة لترتيب حسب المبلغ
CREATE INDEX IF NOT EXISTS idx_supporters_amount ON public.supporters(amount DESC);
CREATE INDEX IF NOT EXISTS idx_supporters_display_order ON public.supporters(display_order);

-- تفعيل Row Level Security
ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة: الجميع يمكنهم القراءة (للعرض في OBS)
CREATE POLICY "الجميع يمكنهم قراءة الداعمين" 
ON public.supporters 
FOR SELECT 
USING (true);

-- سياسة الإدراج: الجميع يمكنهم الإضافة (للإدارة)
CREATE POLICY "الجميع يمكنهم إضافة داعمين" 
ON public.supporters 
FOR INSERT 
WITH CHECK (true);

-- سياسة التحديث: الجميع يمكنهم التحديث (للإدارة)
CREATE POLICY "الجميع يمكنهم تحديث الداعمين" 
ON public.supporters 
FOR UPDATE 
USING (true);

-- سياسة الحذف: الجميع يمكنهم الحذف (للإدارة)
CREATE POLICY "الجميع يمكنهم حذف الداعمين" 
ON public.supporters 
FOR DELETE 
USING (true);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_supporters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger للتحديث التلقائي
CREATE TRIGGER update_supporters_updated_at
BEFORE UPDATE ON public.supporters
FOR EACH ROW
EXECUTE FUNCTION public.update_supporters_updated_at();

-- تفعيل Real-time
ALTER TABLE public.supporters REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.supporters;