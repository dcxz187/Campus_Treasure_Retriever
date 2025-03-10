package com.gongsir.wxapp.utils;


import com.baidu.aip.ocr.AipOcr;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

/**
 * @author gongsir
 */
public class OCRUtil {
    /**
     * 设置百度云AppID/AK/SK
     */
    private static final String APP_ID = "6502684";
    private static final String API_KEY = "CQQckGFM7i7zCzVGffs5URRZ";
    private static final String SECRET_KEY = "RMqaEtVk6cDsxnnAOHlWdhMSy7sI6Fp4";
    /**
     * 设置校园卡的模板id
     */
    private static final String STU_CARD_FONT = "7564c672a47256ca981e1df42480c077";

    public static JSONObject ocr(MultipartFile file, String type) throws Exception {
        if (type.equals("idCard")) {
            return idCard(file);
        }
        if (type.equals("stuCard")) {
            return stuCard(file);
        }
        return null;
    }

    /**
     * 身份证识别
     * @param file image
     * @return info
     * @throws Exception exception
     */
    private static JSONObject idCard(MultipartFile file) throws Exception {
        // 将文件转化为二进制
        byte[] buf = file.getBytes();
        // 初始化百度接口
        AipOcr client = new AipOcr(APP_ID, API_KEY, SECRET_KEY);
        // 调用身份证接口识别身份证
        String res = client.idcard(buf, "front", new HashMap<String, String>()).toString();
        System.out.println(res);
        return new JSONObject(res);
    }

    /**
     * 学生证识别
     * @param file 学生证证件图片
     * @return 识别信息json
     * @throws Exception 异常
     */
    private static JSONObject stuCard(MultipartFile file) throws Exception {
        // 将文件转为二进制
        byte[] buf = file.getBytes();

        // 初始化 OCR 接口
        AipOcr aipOcr = new AipOcr(APP_ID, API_KEY, SECRET_KEY);

        // 调用接口识别信息，返回值是 JSONObject 类型
//        JSONObject res = aipOcr.custom(buf, STU_CARD_FONT, new HashMap<String, String>());
//        JSONObject res = aipOcr.custom(buf, STU_CARD_FONT,new HashMap<String, String>());
        JSONObject res = aipOcr.idcard(buf, STU_CARD_FONT, new HashMap<String, String>());

        // 打印结果
        System.out.println(res.toString());

        return res;
    }

}
