title: 中文测试
date: 2015-01-26 21:55:37
tags:
comments: false
meta:
- name="robots";content="noindex, follow"
---
## 桃花源记
### 朝代：魏晋
### 作者：陶渊明
### 原文：
　　晋太元中，武陵人捕鱼为业。缘溪行，忘路之远近。忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美，落英缤纷，渔人甚异之。复前行，欲穷其林。

　　林尽水源，便得一山，山有小口，仿佛若有光。便舍船，从口入。初极狭，才通人。复行数十步，豁然开朗。土地平旷，屋舍俨然，有良田美池桑竹之属。阡陌交通，鸡犬相闻。其中往来种作，男女衣着，悉如外人。黄发垂髫，并怡然自乐。

　　见渔人，乃大惊，问所从来。具答之。便要还家，设酒杀鸡作食。村中闻有此人，咸来问讯。自云先世避秦时乱，率妻子邑人来此绝境，不复出焉，遂与外人间隔。问今是何世，乃不知有汉，无论魏晋。此人一一为具言所闻，皆叹惋。余人各复延至其家，皆出酒食。停数日，辞去。此中人语云：“不足为外人道也。”(间隔 一作：隔绝)

　　既出，得其船，便扶向路，处处志之。及郡下，诣太守，说如此。太守即遣人随其往，寻向所志，遂迷，不复得路。

　　南阳刘子骥，高尚士也，闻之，欣然规往。未果，寻病终，后遂无问津者。

> 真的猛士，敢于直面惨淡的人生，敢于正视淋漓的鲜血。这是怎样的哀痛者和幸福者？然而造化又常常为庸人设计，以时间的流驶，来洗涤旧迹，仅使留下淡红的血色和微漠的悲哀。在这淡红的血色和微漠的悲哀中，又给人暂得偷生，维持着似人非人的生活。我不知道这样的世界何时是一个尽头！
>

Inline `Code` Test.

```diff
=== modified file 'support-files/mysql.server.sh'
--- support-files/mysql.server.sh   2013-07-16 17:09:54 +0000
+++ support-files/mysql.server.sh   2014-02-17 10:10:30 +0000
@@ -147,68 +147,12 @@
            datadir_set=1
    ;;
       --pid-file=*) mysqld_pid_file_path=`echo "$arg" | sed -e 's/^[^=]*=//'` ;;
+      --socket=*) socket=`echo "$arg" | sed -e 's/^[^=]*=//'` ;;
       --service-startup-timeout=*) service_startup_timeout=`echo "$arg" | sed -e 's/^[^=]*=//'` ;;
     esac
   done
 }

-wait_for_pid () {
-  verb="$1"           # created | removed
-  pid="$2"            # process ID of the program operating on the pid-file
-  pid_file_path="$3" # path to the PID file.
-
-  i=0
-}
```

```js
var example = {
      text: 'Hello world!',
      date: '2015-07-07',
      attachment: {
        name: 'note1',
        count: 1,
      },
      comments: null,
    },
    rules = {
      text: 'required|string',
      date: 'date|date_format:yyyy-MM-dd',
      attachment: {
        name: 'required|string',
        content: 'integer',
      },
      comments: 'array',
    };

console.log(Validator.validate(example, rules));
// => {status: 'failed', [{object: [Object], field: "comments", rule: "array"}]}
```

```java
package stone;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by ppoffice on 2015/12/15.
 */
public class ASTLeaf extends ASTree {
    private static ArrayList<ASTree> empty = new ArrayList<>();
    protected Token token;

    public ASTLeaf(Token t) {
        token = t;
    }

    @Override
    public ASTree child(int i) {
        throw new IndexOutOfBoundsException();
    }

    @Override
    public int numChildren() {
        return 0;
    }

    @Override
    public Iterator<ASTree> children() {
        return empty.iterator();
    }

    public String toString () {
        return token.getText();
    }

    @Override
    public String location() {
        return "at line " + token.getLineNumber();
    }

    public Token token () {
        return token;
    }
}
```