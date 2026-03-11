"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const solutionCards = [
  {

    id: "tech",
    title: "تك",
    description: "تحتاج موقع أو تطبيق؟ تريد أتمتة العمليات؟ تبحث عن حلول مخصصة؟",
    icon: "/figmaAssets/margin-wrap-31.svg",
    features: ["تطوير المواقع الإلكترونية", "تطبيقات الجوال", "الحلول والأنظمة المخصصة"],
    linkText: "استكشف تك",
    gradientOverlay:
      "bg-[linear-gradient(118deg,rgba(6,182,212,0)_0%,rgba(14,165,233,0)_100%)]",
  },
  {
    id: "media",
    title: "ميديا",
    description: "تريد بناء علامتك التجارية؟ تحتاج محتوى جذاب؟ تبحث عن الوصول لعملاء أكثر؟",
    icon: "/figmaAssets/margin-wrap-23.svg",
    features: ["تطوير العلامة التجارية", "إنشاء المحتوى الإبداعي", "التسويق الرقمي والإعلانات"],
    linkText: "استكشف ميديا",
    gradientOverlay:
      "bg-[linear-gradient(118deg,rgba(244,63,94,0)_0%,rgba(236,72,153,0)_100%)]",
  },
  {
    id: "market",
    title: "ماركت",
    description: "تحتاج استراتيجية واضحة؟ تريد فهم سوقك بشكل أعمق؟ تبحث عن تحسين عملية المبيعات؟",
    icon: "/figmaAssets/margin-wrap-29.svg",
    features: ["التخطيط الاستراتيجي", "تحليل السوق والمنافسين", "تحسين النمو والمبيعات"],
    linkText: "استكشف ماركت",
    gradientOverlay:
      "bg-[linear-gradient(118deg,rgba(20,184,166,0)_0%,rgba(16,185,129,0)_100%)]",
  },
];

export default function BusinessNeedsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#090e1a] py-28">
      <div className="absolute left-0 top-0 h-full w-full opacity-5">
        <div className="relative h-full w-full [background:radial-gradient(50%_50%_at_0%_0%,rgba(255,255,255,1)_0%,rgba(0,0,0,0)_0%)]" />
      </div>

      <div className="absolute left-[696px] top-0 h-96 w-96 rounded-full bg-[#d4af370f] blur-[32px]" />
      <div className="absolute left-[360px] top-[851px] h-96 w-96 rounded-full bg-[#d4af370f] blur-[32px]" />

      <div className="relative px-6 lg:px-20">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-end lg:px-6">
          <div className="w-full pb-20">
            <div className="flex w-full flex-col items-end">
              <div className="flex w-full items-start justify-center pb-6">
                <Badge className="h-10 gap-2 rounded-full border-0 bg-[#d4af371a] px-5 py-2.5 hover:bg-[#d4af371a]">
                  <span className="text-center text-sm font-bold leading-5 text-[#d4af37] [direction:rtl]">
                    اختر مسارك
                  </span>
                  <Image className="h-5 w-[14.3px]" alt="Icon" src="/figmaAssets/i-312.svg" width={14} height={20} />
                </Badge>
              </div>

              <div className="w-full pb-6">
                <h2 className="text-center text-4xl font-bold leading-[52px] text-white [direction:rtl] sm:text-5xl sm:leading-[56px] lg:text-6xl lg:leading-[60px]">
                  ماذا يحتاج عملك؟
                </h2>
              </div>

              <div className="flex w-full justify-center">
                <div className="max-w-screen-md text-center">
                  <p className="text-xl font-normal leading-[32.5px] text-[#d0d5da] [direction:rtl]">
                    اختر المجال الذي يناسب أهدافك الحالية. كل قسم مصمم لحل تحديات محددة وتحقيق نتائج قابلة للقياس
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-start justify-end gap-8" dir="ltr">
            {solutionCards.map((service) => (
                      <article
                key={service.id}
                className="flex flex-col items-end overflow-hidden rounded-3xl border-2 border-[#374050] bg-[linear-gradient(118deg,rgba(31,41,55,0.8)_0%,rgba(17,24,39,0.8)_100%)] p-[42px] shadow-[0px_2px_20px_#0000001a] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)] md:w-[calc(50%-1rem)] lg:w-[340.33px]"
              >
                <div className="flex w-full flex-col items-end space-y-4 p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="shrink-0" alt={service.title} src={service.icon} />

                  <div className="flex w-full justify-end flex-col">
                         <h3 className="pb-4 text-3xl font-bold leading-9 text-white [direction:rtl]">{service.title}</h3>
                  <p className="overflow-hidden pb-8 text-ellipsis text-base font-normal leading-[26px] text-[#d0d5da] [direction:rtl] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                    {service.description}
                  </p>
                  </div>

                     <div className="flex w-full flex-col gap-3 pb-10">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center justify-end gap-3">
                        <span className="text-base font-normal leading-6 text-gray-400 [direction:rtl]">{feature}</span>
                        <Image className="h-7 w-5" alt="Feature icon" src="/figmaAssets/i-425.svg" width={20} height={28} />
                      </div>
                    ))}
                  </div>
 
                  

               
  <Button className="h-auto w-full items-center justify-end gap-2 bg-transparent p-0 hover:bg-transparent">
                    <Image className="h-6 w-4" alt="Arrow" src="/figmaAssets/i-391.svg" width={16} height={24} />
                    <span className="text-base font-bold leading-6 text-[#d4af37] [direction:rtl]">{service.linkText}</span>
                  </Button>

                
                </div>
              </article>
            ))}
          </div>

          <div className="w-full pt-20">
            <div className="flex w-full flex-col items-end">
              <div className="w-full pb-6">
                <p className="text-center text-lg font-normal leading-7 text-gray-400 [direction:rtl]">لست متأكدًا أي قسم تحتاج؟</p>
              </div>
              <div className="flex w-full items-start justify-center">
                <Button className="h-14 rounded-2xl bg-white px-10 py-4 shadow-[0px_20px_25px_-5px_#0000001a,0px_8px_10px_-6px_#0000001a] hover:bg-white/90">
                  <span className="text-center text-base font-bold leading-6 text-[#111726] [direction:rtl]">احصل على استشارة مجانية</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

