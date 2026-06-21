import '/auth/firebase_auth/auth_util.dart';
import '/backend/backend.dart';
import '/backend/schema/structs/index.dart';
import '/bottom_sheets/footer/footer_widget.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:ui';
import '/index.dart';
import 'register_widget.dart' show RegisterWidget;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class RegisterModel extends FlutterFlowModel<RegisterWidget> {
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
  // State field(s) for surname widget.
  FocusNode? surnameFocusNode;
  TextEditingController? surnameTextController;
  String? Function(BuildContext, String?)? surnameTextControllerValidator;
  // State field(s) for cell widget.
  FocusNode? cellFocusNode;
  TextEditingController? cellTextController;
  String? Function(BuildContext, String?)? cellTextControllerValidator;
  // State field(s) for branches widget.
  String? branchesValue;
  FormFieldController<String>? branchesValueController;
  // State field(s) for eventName widget.
  String? eventNameValue;
  FormFieldController<String>? eventNameValueController;
  // State field(s) for message widget.
  FocusNode? messageFocusNode;
  TextEditingController? messageTextController;
  String? Function(BuildContext, String?)? messageTextControllerValidator;
  // State field(s) for nameM widget.
  FocusNode? nameMFocusNode;
  TextEditingController? nameMTextController;
  String? Function(BuildContext, String?)? nameMTextControllerValidator;
  // State field(s) for surnameM widget.
  FocusNode? surnameMFocusNode;
  TextEditingController? surnameMTextController;
  String? Function(BuildContext, String?)? surnameMTextControllerValidator;
  // State field(s) for cellM widget.
  FocusNode? cellMFocusNode;
  TextEditingController? cellMTextController;
  String? Function(BuildContext, String?)? cellMTextControllerValidator;
  // State field(s) for branchesM widget.
  String? branchesMValue;
  FormFieldController<String>? branchesMValueController;
  // State field(s) for eventNameM widget.
  String? eventNameMValue;
  FormFieldController<String>? eventNameMValueController;
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
    nameFocusNode?.dispose();
    nameTextController?.dispose();

    surnameFocusNode?.dispose();
    surnameTextController?.dispose();

    cellFocusNode?.dispose();
    cellTextController?.dispose();

    messageFocusNode?.dispose();
    messageTextController?.dispose();

    nameMFocusNode?.dispose();
    nameMTextController?.dispose();

    surnameMFocusNode?.dispose();
    surnameMTextController?.dispose();

    cellMFocusNode?.dispose();
    cellMTextController?.dispose();

    messageMFocusNode?.dispose();
    messageMTextController?.dispose();

    footerModel.dispose();
  }
}
