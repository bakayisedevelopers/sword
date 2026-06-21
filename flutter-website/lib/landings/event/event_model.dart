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
import 'dart:ui';
import '/index.dart';
import 'event_widget.dart' show EventWidget;
import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class EventModel extends FlutterFlowModel<EventWidget> {
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

  // State field(s) for branchesL widget.
  String? branchesLValue1;
  FormFieldController<String>? branchesLValueController1;
  // State field(s) for branchesL widget.
  String? branchesLValue2;
  FormFieldController<String>? branchesLValueController2;
  // Model for footer component.
  late FooterModel footerModel;

  @override
  void initState(BuildContext context) {
    footerModel = createModel(context, () => FooterModel());
  }

  @override
  void dispose() {
    footerModel.dispose();
  }
}
