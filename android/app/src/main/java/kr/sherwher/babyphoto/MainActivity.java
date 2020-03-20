package kr.sherwher.babyphoto;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.ReactActivity;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);


      PackageInfo packageInfo = null;
      try {
          packageInfo = getPackageManager().getPackageInfo(getApplicationContext().getPackageName(), PackageManager.GET_SIGNATURES);
      } catch (PackageManager.NameNotFoundException e){
          e.printStackTrace();
      }
      if (packageInfo != null) {
          for (Signature signature : packageInfo.signatures) {
              try {
                  MessageDigest md = MessageDigest.getInstance("SHA");
                  md.update(signature.toByteArray());
                  Log.w("getPackageInfo", Base64.encodeToString(md.digest(), Base64.NO_WRAP)) ;
              } catch (NoSuchAlgorithmException e) {
                  Log.e("d", "Unable to get MessageDigest. signature=" + signature, e);
              }
          }
      }


  }

  @Override
  protected String getMainComponentName() {
    return "babyphoto";
  }
}
