import '/auth/firebase_auth/auth_util.dart';
import '/backend/backend.dart';
import '/backend/schema/structs/index.dart';
import '/bottom_sheets/footer/footer_widget.dart';
import '/bottom_sheets/sign_up/sign_up_widget.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'dart:ui';
import '/index.dart';
import 'prayer_widget.dart' show PrayerWidget;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class PrayerModel extends FlutterFlowModel<PrayerWidget> {
  ///  Local state fields for this page.

  bool bag = false;

  List<ProductStruct> resultsearch = [];
  void addToResultsearch(ProductStruct item) => resultsearch.add(item);
  void removeFromResultsearch(ProductStruct item) => resultsearch.remove(item);
  void removeAtIndexFromResultsearch(int index) => resultsearch.removeAt(index);
  void insertAtIndexInResultsearch(int index, ProductStruct item) =>
      resultsearch.insert(index, item);
  void updateResultsearchAtIndex(int index, Function(ProductStruct) updateFn) =>
      resultsearch[index] = updateFn(resultsearch[index]);

  ///  State fields for stateful widgets in this page.

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
  // State field(s) for branhces widget.
  String? branhcesValue;
  FormFieldController<String>? branhcesValueController;
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
  // State field(s) for branchesM widget.
  String? branchesMValue;
  FormFieldController<String>? branchesMValueController;
  // Model for footer component.
  late FooterModel footerModel;

  @override
  void initState(BuildContext context) {
    footerModel = createModel(context, () => FooterModel());
  }

  @override
  void dispose() {
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
