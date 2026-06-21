import '/auth/firebase_auth/auth_util.dart';
import '/backend/backend.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'dart:ui';
import 'follow_up_widget.dart' show FollowUpWidget;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class FollowUpModel extends FlutterFlowModel<FollowUpWidget> {
  ///  Local state fields for this component.

  List<DocumentReference> minstries = [];
  void addToMinstries(DocumentReference item) => minstries.add(item);
  void removeFromMinstries(DocumentReference item) => minstries.remove(item);
  void removeAtIndexFromMinstries(int index) => minstries.removeAt(index);
  void insertAtIndexInMinstries(int index, DocumentReference item) =>
      minstries.insert(index, item);
  void updateMinstriesAtIndex(
          int index, Function(DocumentReference) updateFn) =>
      minstries[index] = updateFn(minstries[index]);

  ///  State fields for stateful widgets in this component.

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
  // State field(s) for messageM widget.
  FocusNode? messageMFocusNode;
  TextEditingController? messageMTextController;
  String? Function(BuildContext, String?)? messageMTextControllerValidator;

  @override
  void initState(BuildContext context) {}

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
  }
}
