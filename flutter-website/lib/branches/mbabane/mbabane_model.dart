import '/auth/firebase_auth/auth_util.dart';
import '/backend/backend.dart';
import '/bottom_sheets/footer/footer_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_choice_chips.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'dart:math';
import 'dart:ui';
import '/index.dart';
import 'mbabane_widget.dart' show MbabaneWidget;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:expandable/expandable.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class MbabaneModel extends FlutterFlowModel<MbabaneWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for serviceTimes widget.
  FormFieldController<List<String>>? serviceTimesValueController;
  String? get serviceTimesValue =>
      serviceTimesValueController?.value?.firstOrNull;
  set serviceTimesValue(String? val) =>
      serviceTimesValueController?.value = val != null ? [val] : [];
  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController1;

  // State field(s) for serviceTimesM widget.
  FormFieldController<List<String>>? serviceTimesMValueController;
  String? get serviceTimesMValue =>
      serviceTimesMValueController?.value?.firstOrNull;
  set serviceTimesMValue(String? val) =>
      serviceTimesMValueController?.value = val != null ? [val] : [];
  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController2;

  // State field(s) for name widget.
  FocusNode? nameFocusNode;
  TextEditingController? nameTextController;
  String? Function(BuildContext, String?)? nameTextControllerValidator;
  // State field(s) for cell widget.
  FocusNode? cellFocusNode;
  TextEditingController? cellTextController;
  String? Function(BuildContext, String?)? cellTextControllerValidator;
  // State field(s) for message widget.
  FocusNode? messageFocusNode;
  TextEditingController? messageTextController;
  String? Function(BuildContext, String?)? messageTextControllerValidator;
  // State field(s) for MouseRegion widget.
  bool mouseRegionHovered1 = false;
  // State field(s) for MouseRegion widget.
  bool mouseRegionHovered2 = false;
  // State field(s) for MouseRegion widget.
  bool mouseRegionHovered3 = false;
  // State field(s) for MouseRegion widget.
  bool mouseRegionHovered4 = false;
  // State field(s) for MouseRegion widget.
  bool mouseRegionHovered5 = false;
  // State field(s) for MouseRegion widget.
  bool mouseRegionHovered6 = false;
  // State field(s) for nameM widget.
  FocusNode? nameMFocusNode;
  TextEditingController? nameMTextController;
  String? Function(BuildContext, String?)? nameMTextControllerValidator;
  // State field(s) for cellM widget.
  FocusNode? cellMFocusNode;
  TextEditingController? cellMTextController;
  String? Function(BuildContext, String?)? cellMTextControllerValidator;
  // State field(s) for messageM widget.
  FocusNode? messageMFocusNode;
  TextEditingController? messageMTextController;
  String? Function(BuildContext, String?)? messageMTextControllerValidator;
  // Model for footer component.
  late FooterModel footerModel;

  @override
  void initState(BuildContext context) {
    footerModel = createModel(context, () => FooterModel());
  }

  @override
  void dispose() {
    expandableExpandableController1.dispose();
    expandableExpandableController2.dispose();
    nameFocusNode?.dispose();
    nameTextController?.dispose();

    cellFocusNode?.dispose();
    cellTextController?.dispose();

    messageFocusNode?.dispose();
    messageTextController?.dispose();

    nameMFocusNode?.dispose();
    nameMTextController?.dispose();

    cellMFocusNode?.dispose();
    cellMTextController?.dispose();

    messageMFocusNode?.dispose();
    messageMTextController?.dispose();

    footerModel.dispose();
  }
}
