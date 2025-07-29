package com.rounders.pposeek.common.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Writer 전용 매퍼 어노테이션
 * 쓰기 전용 데이터소스에 연결되는 매퍼에 사용
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WriterInterface {
}
