import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useLocalSettings, formatUSD } from "@/hooks/useLocalSettings";

type Supporter = Database['public']['Tables']['supporters']['Row'];

const Overlay = () => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const { settings } = useLocalSettings();

  useEffect(() => {
    loadSupporters();
    
    // الاشتراك في التحديثات الفورية
    const channel = supabase
      .channel('supporters-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supporters'
        },
        () => {
          loadSupporters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    }
  };

  return (
    <div className={`w-[380px] h-screen overflow-hidden ${
      settings.template === 'purple' ? 'bg-gradient-purple' : settings.template === 'gold' ? 'bg-gradient-gold/20' : 'bg-gradient-main'
    }`} dir="rtl">
      <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-3">
        {/* عنوان أعلى الشريط */}
        <div className="sticky top-0 z-10 -mt-1 mb-2">
          <div className="backdrop-blur-md bg-black/20 border border-white/20 text-white rounded-lg px-4 py-2 text-center font-bold">
            {settings.bannerTitle}
          </div>
        </div>
        {supporters.map((supporter, index) => (
          <div
            key={supporter.id}
            className={`
              relative overflow-hidden rounded-xl p-4 backdrop-blur-md
              border transition-all duration-300 animate-slide-in
              ${
                index < 3
                  ? 'bg-gold/20 border-gold/40 shadow-gold'
                  : 'bg-white/10 border-white/20'
              }
            `}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* شريط متحرك في الأعلى */}
            <div
              className={`
                absolute top-0 left-0 right-0 h-1
                ${index < 3 ? 'bg-gradient-gold animate-shimmer' : 'bg-gradient-purple'}
              `}
            />
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {index < 3 && (
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                  <h3 className="font-bold text-lg text-white drop-shadow-lg">
                    {supporter.name}
                  </h3>
                </div>
                <p className="text-sm font-semibold text-gold-light mb-1">
                  {formatUSD(supporter.amount)}
                </p>
                {supporter.message && (
                  <p className="text-xs text-white/80 line-clamp-2">
                    {supporter.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {supporters.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-lg">لا يوجد داعمين حالياً</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overlay;
