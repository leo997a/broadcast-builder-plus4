import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, Save, X, Paintbrush } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { useLocalSettings } from "@/hooks/useLocalSettings";

type Supporter = Database['public']['Tables']['supporters']['Row'];

const Admin = () => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    message: ""
  });
  const { settings, updateSettings } = useLocalSettings();

  useEffect(() => {
    loadSupporters();
  }, []);

  const loadSupporters = async () => {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .order('amount', { ascending: false });
      
      if (error) throw error;
      setSupporters(data || []);
    } catch (error) {
      console.error('Error loading supporters:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      toast.error('الرجاء إدخال الاسم والمبلغ');
      return;
    }

    try {
      if (editingId) {
        // تحديث
        const { error } = await supabase
          .from('supporters')
          .update({
            name: formData.name,
            amount: parseFloat(formData.amount),
            message: formData.message || null
          })
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('تم التحديث بنجاح');
      } else {
        // إضافة جديد
        const { error } = await supabase
          .from('supporters')
          .insert({
            name: formData.name,
            amount: parseFloat(formData.amount),
            message: formData.message || null
          });
        
        if (error) throw error;
        toast.success('تمت الإضافة بنجاح');
      }
      
      resetForm();
      loadSupporters();
    } catch (error) {
      console.error('Error saving supporter:', error);
      toast.error('فشل في حفظ البيانات');
    }
  };

  const handleEdit = (supporter: Supporter) => {
    setEditingId(supporter.id);
    setFormData({
      name: supporter.name,
      amount: supporter.amount.toString(),
      message: supporter.message || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    
    try {
      const { error } = await supabase
        .from('supporters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم الحذف بنجاح');
      loadSupporters();
    } catch (error) {
      console.error('Error deleting supporter:', error);
      toast.error('فشل في الحذف');
    }
  };

  const resetForm = () => {
    setFormData({ name: "", amount: "", message: "" });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-main">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main py-10 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            لوحة تحكم الداعمين
          </h1>
          <p className="text-white/80 text-lg">
            إدارة قائمة الداعمين بكل سهولة
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button asChild variant="secondary" size="lg">
              <a href="/overlay" target="_blank">
                عرض شريط OBS
              </a>
            </Button>
            <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <a href="/">
                الرئيسية
              </a>
            </Button>
          </div>
        </div>

        {/* إعدادات عامة */}
        <Card className="glass border-white/20 shadow-elegant mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">⚙️ إعدادات الشريط</CardTitle>
            <CardDescription>تخصيص العنوان والقالب وعملة العرض</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">عنوان الشريط</label>
                <Input
                  value={settings.bannerTitle}
                  onChange={(e) => updateSettings({ bannerTitle: e.target.value })}
                  placeholder="داعمي القناة شهر 11"
                  className="text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العملة</label>
                <Input value="USD ($)" readOnly className="bg-muted text-right" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">القالب/التصميم</label>
                <div className="flex gap-3">
                  <Button type="button" variant={settings.template === 'classic' ? 'default' : 'outline'} onClick={() => updateSettings({ template: 'classic' })}>
                    <Paintbrush className="ml-2 h-4 w-4" /> كلاسيكي
                  </Button>
                  <Button type="button" variant={settings.template === 'purple' ? 'default' : 'outline'} onClick={() => updateSettings({ template: 'purple' })}>
                    <Paintbrush className="ml-2 h-4 w-4" /> بنفسجي
                  </Button>
                  <Button type="button" variant={settings.template === 'gold' ? 'default' : 'outline'} onClick={() => updateSettings({ template: 'gold' })}>
                    <Paintbrush className="ml-2 h-4 w-4" /> ذهبي
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="glass border-white/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {editingId ? '✏️ تعديل داعم' : '➕ إضافة داعم جديد'}
              </CardTitle>
              <CardDescription>
                أدخل بيانات الداعم أدناه
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الاسم <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم الداعم"
                    className="text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    المبلغ <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الرسالة (اختياري)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="رسالة من الداعم..."
                    className="text-right resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-gradient-gold hover:opacity-90">
                    {editingId ? (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ التعديل
                      </>
                    ) : (
                      <>
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة
                      </>
                    )}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="ml-2 h-4 w-4" />
                      إلغاء
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List Section */}
          <Card className="glass border-white/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                📋 قائمة الداعمين ({supporters.length})
              </CardTitle>
              <CardDescription>
                مرتبة حسب المبلغ من الأعلى للأقل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {supporters.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    لا يوجد داعمين حالياً
                  </div>
                ) : (
                  supporters.map((supporter, index) => (
                    <div
                      key={supporter.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        index < 3
                          ? 'bg-gradient-gold border-gold shadow-gold'
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span className="text-2xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                            <h3 className="font-bold text-lg">{supporter.name}</h3>
                          </div>
                          <p className="text-sm font-semibold text-accent-foreground">
                            ${supporter.amount.toFixed(2)} USD
                          </p>
                          {supporter.message && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {supporter.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(supporter)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(supporter.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
