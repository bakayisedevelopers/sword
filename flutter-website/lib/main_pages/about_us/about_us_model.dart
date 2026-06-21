import '/backend/backend.dart';
import '/bottom_sheets/footer/footer_widget.dart';
import '/bottom_sheets/footer_tope/footer_tope_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_video_player.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:math';
import 'dart:ui';
import '/index.dart';
import 'about_us_widget.dart' show AboutUsWidget;
import 'package:carousel_slider/carousel_slider.dart';
import 'package:expandable/expandable.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webviewx_plus/webviewx_plus.dart';

class AboutUsModel extends FlutterFlowModel<AboutUsWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for Carousel widget.
  CarouselSliderController? carouselController1;
  int carouselCurrentIndex1 = 1;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController1;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController2;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController3;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController4;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController5;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController6;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController7;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController8;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController9;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController10;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController11;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController12;

  // Model for footerTope component.
  late FooterTopeModel footerTopeModel1;
  // Model for footer component.
  late FooterModel footerModel1;
  // State field(s) for Carousel widget.
  CarouselSliderController? carouselController2;
  int carouselCurrentIndex2 = 1;

  // State field(s) for Carousel widget.
  CarouselSliderController? carouselController3;
  int carouselCurrentIndex3 = 1;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController13;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController14;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController15;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController16;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController17;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController18;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController19;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController20;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController21;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController22;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController23;

  // State field(s) for Expandable widget.
  late ExpandableController expandableExpandableController24;

  // Model for footerTope component.
  late FooterTopeModel footerTopeModel2;
  // Model for footer component.
  late FooterModel footerModel2;

  @override
  void initState(BuildContext context) {
    footerTopeModel1 = createModel(context, () => FooterTopeModel());
    footerModel1 = createModel(context, () => FooterModel());
    footerTopeModel2 = createModel(context, () => FooterTopeModel());
    footerModel2 = createModel(context, () => FooterModel());
  }

  @override
  void dispose() {
    expandableExpandableController1.dispose();
    expandableExpandableController2.dispose();
    expandableExpandableController3.dispose();
    expandableExpandableController4.dispose();
    expandableExpandableController5.dispose();
    expandableExpandableController6.dispose();
    expandableExpandableController7.dispose();
    expandableExpandableController8.dispose();
    expandableExpandableController9.dispose();
    expandableExpandableController10.dispose();
    expandableExpandableController11.dispose();
    expandableExpandableController12.dispose();
    footerTopeModel1.dispose();
    footerModel1.dispose();
    expandableExpandableController13.dispose();
    expandableExpandableController14.dispose();
    expandableExpandableController15.dispose();
    expandableExpandableController16.dispose();
    expandableExpandableController17.dispose();
    expandableExpandableController18.dispose();
    expandableExpandableController19.dispose();
    expandableExpandableController20.dispose();
    expandableExpandableController21.dispose();
    expandableExpandableController22.dispose();
    expandableExpandableController23.dispose();
    expandableExpandableController24.dispose();
    footerTopeModel2.dispose();
    footerModel2.dispose();
  }
}
