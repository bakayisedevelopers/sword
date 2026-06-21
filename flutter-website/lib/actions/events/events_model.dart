import '/backend/backend.dart';
import '/bottom_sheets/footer/footer_widget.dart';
import '/bottom_sheets/footer_tope/footer_tope_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_choice_chips.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:math';
import 'dart:ui';
import '/index.dart';
import 'events_widget.dart' show EventsWidget;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class EventsModel extends FlutterFlowModel<EventsWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for branch widget.
  FormFieldController<List<String>>? branchValueController;
  String? get branchValue => branchValueController?.value?.firstOrNull;
  set branchValue(String? val) =>
      branchValueController?.value = val != null ? [val] : [];
  // Model for footerTope component.
  late FooterTopeModel footerTopeModel;
  // Model for footer component.
  late FooterModel footerModel;

  @override
  void initState(BuildContext context) {
    footerTopeModel = createModel(context, () => FooterTopeModel());
    footerModel = createModel(context, () => FooterModel());
  }

  @override
  void dispose() {
    footerTopeModel.dispose();
    footerModel.dispose();
  }
}
