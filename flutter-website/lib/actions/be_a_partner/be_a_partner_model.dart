import '/auth/firebase_auth/auth_util.dart';
import '/backend/backend.dart';
import '/backend/schema/structs/index.dart';
import '/bottom_sheets/footer/footer_widget.dart';
import '/flutter_flow/flutter_flow_choice_chips.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'dart:ui';
import '/index.dart';
import 'be_a_partner_widget.dart' show BeAPartnerWidget;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class BeAPartnerModel extends FlutterFlowModel<BeAPartnerWidget> {
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
  DateTime? datePicked1;
  // State field(s) for DOBField widget.
  FocusNode? dOBFieldFocusNode;
  TextEditingController? dOBFieldTextController;
  String? Function(BuildContext, String?)? dOBFieldTextControllerValidator;
  // State field(s) for branches widget.
  String? branchesValue;
  FormFieldController<String>? branchesValueController;
  // State field(s) for occupation widget.
  FocusNode? occupationFocusNode;
  TextEditingController? occupationTextController;
  String? Function(BuildContext, String?)? occupationTextControllerValidator;
  // State field(s) for wrokplace widget.
  FocusNode? wrokplaceFocusNode;
  TextEditingController? wrokplaceTextController;
  String? Function(BuildContext, String?)? wrokplaceTextControllerValidator;
  // State field(s) for address widget.
  FocusNode? addressFocusNode;
  TextEditingController? addressTextController;
  String? Function(BuildContext, String?)? addressTextControllerValidator;
  // State field(s) for city widget.
  FocusNode? cityFocusNode;
  TextEditingController? cityTextController;
  String? Function(BuildContext, String?)? cityTextControllerValidator;
  // State field(s) for province widget.
  FocusNode? provinceFocusNode;
  TextEditingController? provinceTextController;
  String? Function(BuildContext, String?)? provinceTextControllerValidator;
  // State field(s) for code widget.
  FocusNode? codeFocusNode;
  TextEditingController? codeTextController;
  String? Function(BuildContext, String?)? codeTextControllerValidator;
  // State field(s) for cell widget.
  FocusNode? cellFocusNode;
  TextEditingController? cellTextController;
  String? Function(BuildContext, String?)? cellTextControllerValidator;
  // State field(s) for email widget.
  FocusNode? emailFocusNode;
  TextEditingController? emailTextController;
  String? Function(BuildContext, String?)? emailTextControllerValidator;
  // State field(s) for bornAgain widget.
  FormFieldController<List<String>>? bornAgainValueController1;
  String? get bornAgainValue1 => bornAgainValueController1?.value?.firstOrNull;
  set bornAgainValue1(String? val) =>
      bornAgainValueController1?.value = val != null ? [val] : [];
  DateTime? datePicked2;
  // State field(s) for DOB widget.
  FocusNode? dobFocusNode;
  TextEditingController? dobTextController;
  String? Function(BuildContext, String?)? dobTextControllerValidator;
  // State field(s) for baptized widget.
  FormFieldController<List<String>>? baptizedValueController;
  String? get baptizedValue => baptizedValueController?.value?.firstOrNull;
  set baptizedValue(String? val) =>
      baptizedValueController?.value = val != null ? [val] : [];
  // State field(s) for filled widget.
  FormFieldController<List<String>>? filledValueController;
  String? get filledValue => filledValueController?.value?.firstOrNull;
  set filledValue(String? val) =>
      filledValueController?.value = val != null ? [val] : [];
  // State field(s) for tongues widget.
  FormFieldController<List<String>>? tonguesValueController;
  String? get tonguesValue => tonguesValueController?.value?.firstOrNull;
  set tonguesValue(String? val) =>
      tonguesValueController?.value = val != null ? [val] : [];
  // State field(s) for homeCell widget.
  FormFieldController<List<String>>? homeCellValueController;
  String? get homeCellValue => homeCellValueController?.value?.firstOrNull;
  set homeCellValue(String? val) =>
      homeCellValueController?.value = val != null ? [val] : [];
  // State field(s) for homeCellName widget.
  FocusNode? homeCellNameFocusNode;
  TextEditingController? homeCellNameTextController;
  String? Function(BuildContext, String?)? homeCellNameTextControllerValidator;
  // Stores action output result for [Backend Call - Create Document] action in Button widget.
  PartnersRecord? parentDoc;
  // State field(s) for nameKid widget.
  FocusNode? nameKidFocusNode;
  TextEditingController? nameKidTextController;
  String? Function(BuildContext, String?)? nameKidTextControllerValidator;
  // State field(s) for surnameKid widget.
  FocusNode? surnameKidFocusNode;
  TextEditingController? surnameKidTextController;
  String? Function(BuildContext, String?)? surnameKidTextControllerValidator;
  DateTime? datePicked3;
  // State field(s) for DOBKidField widget.
  FocusNode? dOBKidFieldFocusNode;
  TextEditingController? dOBKidFieldTextController;
  String? Function(BuildContext, String?)? dOBKidFieldTextControllerValidator;
  // State field(s) for branchesM widget.
  String? branchesMValue;
  FormFieldController<String>? branchesMValueController;
  // State field(s) for nameM widget.
  FocusNode? nameMFocusNode;
  TextEditingController? nameMTextController;
  String? Function(BuildContext, String?)? nameMTextControllerValidator;
  // State field(s) for surnameM widget.
  FocusNode? surnameMFocusNode;
  TextEditingController? surnameMTextController;
  String? Function(BuildContext, String?)? surnameMTextControllerValidator;
  DateTime? datePicked4;
  // State field(s) for DOBFieldMo widget.
  FocusNode? dOBFieldMoFocusNode;
  TextEditingController? dOBFieldMoTextController;
  String? Function(BuildContext, String?)? dOBFieldMoTextControllerValidator;
  // State field(s) for occupationM widget.
  FocusNode? occupationMFocusNode;
  TextEditingController? occupationMTextController;
  String? Function(BuildContext, String?)? occupationMTextControllerValidator;
  // State field(s) for wrokplaceM widget.
  FocusNode? wrokplaceMFocusNode;
  TextEditingController? wrokplaceMTextController;
  String? Function(BuildContext, String?)? wrokplaceMTextControllerValidator;
  // State field(s) for cellM widget.
  FocusNode? cellMFocusNode;
  TextEditingController? cellMTextController;
  String? Function(BuildContext, String?)? cellMTextControllerValidator;
  // State field(s) for emailM widget.
  FocusNode? emailMFocusNode;
  TextEditingController? emailMTextController;
  String? Function(BuildContext, String?)? emailMTextControllerValidator;
  // State field(s) for addressM widget.
  FocusNode? addressMFocusNode;
  TextEditingController? addressMTextController;
  String? Function(BuildContext, String?)? addressMTextControllerValidator;
  // State field(s) for cityM widget.
  FocusNode? cityMFocusNode;
  TextEditingController? cityMTextController;
  String? Function(BuildContext, String?)? cityMTextControllerValidator;
  // State field(s) for provinceM widget.
  FocusNode? provinceMFocusNode;
  TextEditingController? provinceMTextController;
  String? Function(BuildContext, String?)? provinceMTextControllerValidator;
  // State field(s) for codeM widget.
  FocusNode? codeMFocusNode;
  TextEditingController? codeMTextController;
  String? Function(BuildContext, String?)? codeMTextControllerValidator;
  // State field(s) for bornAgain widget.
  FormFieldController<List<String>>? bornAgainValueController2;
  String? get bornAgainValue2 => bornAgainValueController2?.value?.firstOrNull;
  set bornAgainValue2(String? val) =>
      bornAgainValueController2?.value = val != null ? [val] : [];
  DateTime? datePicked5;
  // State field(s) for DOBMob widget.
  FocusNode? dOBMobFocusNode;
  TextEditingController? dOBMobTextController;
  String? Function(BuildContext, String?)? dOBMobTextControllerValidator;
  // State field(s) for baptizedM widget.
  FormFieldController<List<String>>? baptizedMValueController;
  String? get baptizedMValue => baptizedMValueController?.value?.firstOrNull;
  set baptizedMValue(String? val) =>
      baptizedMValueController?.value = val != null ? [val] : [];
  // State field(s) for filledM widget.
  FormFieldController<List<String>>? filledMValueController;
  String? get filledMValue => filledMValueController?.value?.firstOrNull;
  set filledMValue(String? val) =>
      filledMValueController?.value = val != null ? [val] : [];
  // State field(s) for tonguesM widget.
  FormFieldController<List<String>>? tonguesMValueController;
  String? get tonguesMValue => tonguesMValueController?.value?.firstOrNull;
  set tonguesMValue(String? val) =>
      tonguesMValueController?.value = val != null ? [val] : [];
  // State field(s) for homeCellM widget.
  FormFieldController<List<String>>? homeCellMValueController;
  String? get homeCellMValue => homeCellMValueController?.value?.firstOrNull;
  set homeCellMValue(String? val) =>
      homeCellMValueController?.value = val != null ? [val] : [];
  // State field(s) for homeCellNameM widget.
  FocusNode? homeCellNameMFocusNode;
  TextEditingController? homeCellNameMTextController;
  String? Function(BuildContext, String?)? homeCellNameMTextControllerValidator;
  // Stores action output result for [Backend Call - Create Document] action in Button widget.
  PartnersRecord? parentDocM;
  // State field(s) for nameKidM widget.
  FocusNode? nameKidMFocusNode;
  TextEditingController? nameKidMTextController;
  String? Function(BuildContext, String?)? nameKidMTextControllerValidator;
  // State field(s) for surnameKidM widget.
  FocusNode? surnameKidMFocusNode;
  TextEditingController? surnameKidMTextController;
  String? Function(BuildContext, String?)? surnameKidMTextControllerValidator;
  DateTime? datePicked6;
  // State field(s) for DOBKidFieldM widget.
  FocusNode? dOBKidFieldMFocusNode;
  TextEditingController? dOBKidFieldMTextController;
  String? Function(BuildContext, String?)? dOBKidFieldMTextControllerValidator;
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

    dOBFieldFocusNode?.dispose();
    dOBFieldTextController?.dispose();

    occupationFocusNode?.dispose();
    occupationTextController?.dispose();

    wrokplaceFocusNode?.dispose();
    wrokplaceTextController?.dispose();

    addressFocusNode?.dispose();
    addressTextController?.dispose();

    cityFocusNode?.dispose();
    cityTextController?.dispose();

    provinceFocusNode?.dispose();
    provinceTextController?.dispose();

    codeFocusNode?.dispose();
    codeTextController?.dispose();

    cellFocusNode?.dispose();
    cellTextController?.dispose();

    emailFocusNode?.dispose();
    emailTextController?.dispose();

    dobFocusNode?.dispose();
    dobTextController?.dispose();

    homeCellNameFocusNode?.dispose();
    homeCellNameTextController?.dispose();

    nameKidFocusNode?.dispose();
    nameKidTextController?.dispose();

    surnameKidFocusNode?.dispose();
    surnameKidTextController?.dispose();

    dOBKidFieldFocusNode?.dispose();
    dOBKidFieldTextController?.dispose();

    nameMFocusNode?.dispose();
    nameMTextController?.dispose();

    surnameMFocusNode?.dispose();
    surnameMTextController?.dispose();

    dOBFieldMoFocusNode?.dispose();
    dOBFieldMoTextController?.dispose();

    occupationMFocusNode?.dispose();
    occupationMTextController?.dispose();

    wrokplaceMFocusNode?.dispose();
    wrokplaceMTextController?.dispose();

    cellMFocusNode?.dispose();
    cellMTextController?.dispose();

    emailMFocusNode?.dispose();
    emailMTextController?.dispose();

    addressMFocusNode?.dispose();
    addressMTextController?.dispose();

    cityMFocusNode?.dispose();
    cityMTextController?.dispose();

    provinceMFocusNode?.dispose();
    provinceMTextController?.dispose();

    codeMFocusNode?.dispose();
    codeMTextController?.dispose();

    dOBMobFocusNode?.dispose();
    dOBMobTextController?.dispose();

    homeCellNameMFocusNode?.dispose();
    homeCellNameMTextController?.dispose();

    nameKidMFocusNode?.dispose();
    nameKidMTextController?.dispose();

    surnameKidMFocusNode?.dispose();
    surnameKidMTextController?.dispose();

    dOBKidFieldMFocusNode?.dispose();
    dOBKidFieldMTextController?.dispose();

    footerModel.dispose();
  }
}
