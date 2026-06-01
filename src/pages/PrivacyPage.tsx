import React from 'react';
import Markdown from 'react-markdown';

const privacyMarkdown = `
# 隱私權政策

樂卡科技有限公司（以下簡稱「MiniStyleCards」或「我們」）非常尊重客戶的隱私權，對於您的個人資料，均會有嚴格的保密措施。為保護您的隱私及讓您明瞭我們如何蒐集、應用及保護您所提供的個人資訊，請您詳細閱讀本隱私權政策。

## 一、個人資料蒐集目的與類別

我們蒐集個人資料的目的，在於提供您更好的客製化商品（包含喜帖、結婚書約、婚禮小物等）與服務。
蒐集的類別包含：
1. **辨識個人者：**如姓名、聯絡地址、電話、電子郵件等。
2. **辨識財務者：**如信用卡或金融機構帳戶資訊。
3. **客製化所需資訊：**如婚宴日期、地點、中英文姓名等客製化喜帖及婚禮網站所需之資訊。

## 二、個人資料利用期間、地區、對象及方式

1. **期間：**本網站服務營運期間或您要求刪除個人資料前。
2. **地區：**您的個人資料將用於我們及合作廠商營運所在地區。
3. **對象與方式：**您的資料將用於我們提供客製化商品製作、金流與物流服務、服務訊息通知等。我們絕不會將您的資料出售、交換或出租給與本服務無關之第三人。

## 三、您的權利

您可以隨時透過我們提供的聯絡管道（info@ministylecards.com）行使以下權利：
1. 查詢或請求閱覽。
2. 請求製給複製本。
3. 請求補充或更正。
4. 請求停止蒐集、處理或利用。
5. 請求刪除。
（註：因下單後需進行客製化服務，若於商品製作期間請求刪除資料，可能影響訂單之完成與商品寄送。）

## 四、資料安全

我們以合理之技術及程序（包含金流採用合作銀行之加密驗證）保障所有個人資料之安全，防止您的個人資料被竊取、竄改、毀損、滅失或洩漏。

## 五、Cookie 技術的使用

為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的 Cookie。若您不願接受 Cookie 的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕 Cookie 的寫入，但可能會導致網站某些功能無法正常執行。

## 六、隱私權政策之修改

我們保留隨時修改本隱私權政策之權利，修改後的條款將公佈於本網站上，我們建議您隨時注意該等修改或變更。若您於任何修改或變更後繼續使用本網站服務，視為您已閱讀、瞭解並同意接受該等修改或變更。

---

如果對本隱私權政策有任何疑問，歡迎隨時與我們聯繫：
* **Email:** info@ministylecards.com
* **電話:** (03) 468-7530
`;

export function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 px-4 md:px-12 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-medium tracking-wider mb-2">隱私權政策</h1>
        <p className="text-gray-500 font-serif italic">Privacy Policy</p>
      </div>

      <div className="prose prose-sm md:prose-base prose-headings:font-normal prose-headings:tracking-widest prose-h1:hidden prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:font-medium prose-strong:text-gray-900 max-w-none">
        <Markdown>{privacyMarkdown}</Markdown>
      </div>
    </div>
  );
}
