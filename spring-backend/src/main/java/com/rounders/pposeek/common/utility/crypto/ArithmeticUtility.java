/*****************************************************************
 * 
 * PPoseek Web Application - Arithmetic Utility
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto;

import java.util.Base64;

/**
 * 바이트 배열과 문자열 간 변환 유틸리티.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
public final class ArithmeticUtility {

    /**
     * ArithmeticUtility Constructor
     * <p>유틸리티 클래스는 생성자를 이용해 생성하는 것을 금지한다.</p>
     */
    private ArithmeticUtility() {
        throw new IllegalStateException("Utility Class");
    }

    /**
     * 바이트 배열을 Base64 문자열로 변환.
     * 
     * @param bytes 바이트 배열
     * @return Base64 문자열
     */
    public static String bytesToBase64String(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(bytes);
    }

    /**
     * Base64 문자열을 바이트 배열로 변환.
     * 
     * @param base64String Base64 문자열
     * @return 바이트 배열
     */
    public static byte[] base64StringToBytes(String base64String) {
        if (base64String == null) {
            return null;
        }
        return Base64.getDecoder().decode(base64String);
    }

    /**
     * 바이트 배열을 16진수 소문자 문자열로 변환.
     * 
     * @param bytes 바이트 배열
     * @return 16진수 소문자 문자열
     */
    public static String bytesToHexStringLowerCase(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    /**
     * 바이트 배열을 16진수 대문자 문자열로 변환.
     * 
     * @param bytes 바이트 배열
     * @return 16진수 대문자 문자열
     */
    public static String bytesToHexStringUpperCase(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }

    /**
     * 16진수 문자열을 바이트 배열로 변환.
     * 
     * @param hexString 16진수 문자열
     * @return 바이트 배열
     */
    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.length() % 2 != 0) {
            return null;
        }
        
        byte[] bytes = new byte[hexString.length() / 2];
        for (int i = 0; i < hexString.length(); i += 2) {
            bytes[i / 2] = (byte) Integer.parseInt(hexString.substring(i, i + 2), 16);
        }
        return bytes;
    }
}
