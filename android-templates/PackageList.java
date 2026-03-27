package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.horcrux.svg.SvgPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private ReactInstanceManager reactInstanceManager;
  private MainPackageConfig mConfig;

  public PackageList(ReactInstanceManager reactInstanceManager) {
    this(reactInstanceManager.getCurrentReactContext().getApplicationContext());
    this.reactInstanceManager = reactInstanceManager;
    reactNativeHost = null;
  }

  public PackageList(Application application) {
    this(application, null);
    reactNativeHost = null;
  }

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost.getApplication(), reactNativeHost.getUseDeveloperSupport() ? MainPackageConfig.builder().build() : null);
    this.reactNativeHost = reactNativeHost;
  }

  public PackageList(Application application, MainPackageConfig hardcodedConfig) {
    this.application = application;
    mConfig = hardcodedConfig;
  }

  private ReactNativeHost getReactNativeHost() {
    return reactNativeHost;
  }

  private Resources getResources() {
    return getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.asList(
      new MainReactPackage(mConfig),
      new RNGestureHandlerPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new SvgPackage()
    ));
  }
}
