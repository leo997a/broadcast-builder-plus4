import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Settings, Eye } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-main" dir="rtl">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-slide-in">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            نظام إدارة الداعمين
          </h1>
          <p className="text-2xl text-white/90 mb-4">
            احترافية عالية في عرض وإدارة قائمة داعميك
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            نظام متكامل مع تحديثات فورية لعرض الداعمين في بثك المباشر على OBS
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* بطاقة لوحة الإدارة */}
          <Card className="glass border-white/20 shadow-elegant hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-primary">
                لوحة الإدارة
              </CardTitle>
              <CardDescription className="text-base">
                أضف، عدل، واحذف الداعمين بكل سهولة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-gold text-lg">✓</span>
                  <span>إضافة داعمين جدد بسرعة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold text-lg">✓</span>
                  <span>تعديل معلومات الداعمين</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold text-lg">✓</span>
                  <span>ترتيب تلقائي حسب المبلغ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold text-lg">✓</span>
                  <span>واجهة سهلة وعصرية</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-gradient-gold hover:opacity-90">
                <a href="/admin">
                  <Settings className="ml-2 h-5 w-5" />
                  فتح لوحة الإدارة
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* بطاقة شريط OBS */}
          <Card className="glass border-white/20 shadow-elegant hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-primary">
                شريط OBS
              </CardTitle>
              <CardDescription className="text-base">
                عرض احترافي للداعمين في البث المباشر
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple text-lg">✓</span>
                  <span>تحديثات فورية تلقائية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple text-lg">✓</span>
                  <span>تصميم شفاف مناسب لـ OBS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple text-lg">✓</span>
                  <span>عرض 380 بكسل (مثالي للبث)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple text-lg">✓</span>
                  <span>تمييز الداعمين الأوائل</span>
                </li>
              </ul>
              <Button asChild variant="secondary" className="w-full">
                <a href="/overlay" target="_blank">
                  <ExternalLink className="ml-2 h-5 w-5" />
                  فتح شريط OBS
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* تعليمات OBS */}
        <Card className="glass border-white/20 shadow-elegant max-w-4xl mx-auto mt-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              📚 كيفية إضافة الشريط في OBS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold">
                  1
                </span>
                <div>
                  <p className="font-medium">افتح OBS Studio</p>
                  <p className="text-sm text-muted-foreground">
                    قم بتشغيل برنامج OBS على جهازك
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold">
                  2
                </span>
                <div>
                  <p className="font-medium">أضف مصدر Browser</p>
                  <p className="text-sm text-muted-foreground">
                    اضغط على + في قسم Sources واختر Browser
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold">
                  3
                </span>
                <div>
                  <p className="font-medium">انسخ رابط الشريط</p>
                  <p className="text-sm text-muted-foreground">
                    الصق الرابط الكامل لصفحة /overlay في خانة URL
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold">
                  4
                </span>
                <div>
                  <p className="font-medium">اضبط الإعدادات</p>
                  <p className="text-sm text-muted-foreground">
                    Width: 380 | Height: 1080 | اضغط OK
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-white/60">
          <p className="text-sm">
            مبني بـ ❤️ باستخدام Lovable Cloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
