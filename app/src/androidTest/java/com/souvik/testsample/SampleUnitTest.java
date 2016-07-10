package com.souvik.testsample;

import android.test.suitebuilder.annotation.SmallTest;

import com.souvik.unittestsample.LoginActivity;

import junit.framework.TestCase;

/**
 * Created by Souvik on 01-05-2016.
 */
public class SampleUnitTest extends TestCase {

    @Override
    protected void setUp() throws Exception {
        super.setUp();
    }

    @SmallTest
    public void testFunction()
    {
        LoginActivity dummy = new LoginActivity();
        assertEquals(true,dummy.attemptLogin());
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }
}
