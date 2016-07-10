package com.souvik.testsample;

import android.test.ActivityInstrumentationTestCase2;
import android.test.suitebuilder.annotation.SmallTest;
import android.widget.Button;
import android.widget.EditText;

import com.souvik.unittestsample.LoginActivity;
import com.souvik.unittestsample.R;

/**
 * Created by Souvik on 01-05-2016.
 */
public class SampleInstrumentationTest extends ActivityInstrumentationTestCase2<LoginActivity> {
    public SampleInstrumentationTest() {
        super(LoginActivity.class);
    }

    @Override
    protected void setUp() throws Exception {
        super.setUp();
    }

    @SmallTest
    public void testEmail()
    {
        EditText mEmailView = (EditText)getActivity().findViewById(R.id.email);
        assertNotNull(mEmailView);
    }

    @SmallTest
    public void testPassword()
    {
        EditText mPassword = (EditText)getActivity().findViewById(R.id.password);
        assertNotNull(mPassword);
    }

    @SmallTest
    public void testSigninButton()
    {
        Button mEmailSignInButton = (Button)getActivity().findViewById(R.id.email_sign_in_button);
        assertNotNull(mEmailSignInButton);
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }
}
