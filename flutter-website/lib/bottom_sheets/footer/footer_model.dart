import '/bottom_sheets/footer_desktop/footer_desktop_widget.dart';
import '/bottom_sheets/footer_mobile/footer_mobile_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import 'footer_widget.dart' show FooterWidget;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class FooterModel extends FlutterFlowModel<FooterWidget> {
  ///  State fields for stateful widgets in this component.

  // Model for footerDesktop component.
  late FooterDesktopModel footerDesktopModel;
  // Model for footerMobile component.
  late FooterMobileModel footerMobileModel;

  @override
  void initState(BuildContext context) {
    footerDesktopModel = createModel(context, () => FooterDesktopModel());
    footerMobileModel = createModel(context, () => FooterMobileModel());
  }

  @override
  void dispose() {
    footerDesktopModel.dispose();
    footerMobileModel.dispose();
  }
}
