package com.projectapp.util;

import at.favre.lib.crypto.bcrypt.BCrypt;

public class PasswordUtil {
    
    public static String encodePassword(String password) {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray());
    }
    
    public static boolean verifyPassword(String password, String hash) {
        BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), hash);
        return result.verified;
    }
}

