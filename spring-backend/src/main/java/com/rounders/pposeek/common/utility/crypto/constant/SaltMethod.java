/*****************************************************************
 * 
 * PPoseek Web Application - Salt Method Constants
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto.constant;

/**
 * Salt 생성 방식 상수.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
public enum SaltMethod {
    
    /**
     * PPoseek 고정 Salt (권장)
     */
    PPOSEEK,
    
    /**
     * 랜덤 Salt
     */
    RANDOM
}
