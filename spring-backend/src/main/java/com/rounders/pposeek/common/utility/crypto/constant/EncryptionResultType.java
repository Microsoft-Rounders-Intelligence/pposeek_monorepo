/*****************************************************************
 * 
 * PPoseek Web Application - Encryption Result Type Constants
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto.constant;

/**
 * 암호화 결과값 인코딩 형식 상수.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
public enum EncryptionResultType {
    
    /**
     * Base64 인코딩
     */
    BASE64(1),
    
    /**
     * 16진수 소문자
     */
    HEX_LOWER_CASE(2),
    
    /**
     * 16진수 대문자 (기본값)
     */
    HEX_UPPER_CASE(3);
    
    private final int value;
    
    EncryptionResultType(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }
}
