/* @ds-bundle: {"format":4,"namespace":"HeritageMuseumDesignSystem_5a5154","components":[{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"CollectionCard","sourcePath":"components/cards/CollectionCard.jsx"},{"name":"EventCard","sourcePath":"components/cards/EventCard.jsx"},{"name":"ItemCard","sourcePath":"components/cards/ItemCard.jsx"},{"name":"RecommendationCard","sourcePath":"components/cards/RecommendationCard.jsx"},{"name":"StatCard","sourcePath":"components/cards/StatCard.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"FilterPanel","sourcePath":"components/data/FilterPanel.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Drawer","sourcePath":"components/feedback/Drawer.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"SkeletonCard","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"DateTimeField","sourcePath":"components/forms/DateTimeField.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"ImageUpload","sourcePath":"components/forms/ImageUpload.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Icon","sourcePath":"components/foundation/Icon.jsx"},{"name":"Logo","sourcePath":"components/foundation/Logo.jsx"},{"name":"Media","sourcePath":"components/foundation/Media.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"StaffSidebar","sourcePath":"components/navigation/StaffSidebar.jsx"},{"name":"StaffTopBar","sourcePath":"components/navigation/StaffTopBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/cards/Card.jsx":"4adf1e38ac54","components/cards/CollectionCard.jsx":"88a874628db4","components/cards/EventCard.jsx":"8f31ae8dbb56","components/cards/ItemCard.jsx":"5ef70569b2c5","components/cards/RecommendationCard.jsx":"b3ba2028b374","components/cards/StatCard.jsx":"8e8015f73587","components/data/DataTable.jsx":"8715a1d49b79","components/data/FilterPanel.jsx":"17efd962d67d","components/feedback/Alert.jsx":"6c76c88a053e","components/feedback/Drawer.jsx":"a07d11e32221","components/feedback/EmptyState.jsx":"dfb9cdb374e4","components/feedback/Modal.jsx":"73d8d498e8c3","components/feedback/Skeleton.jsx":"0982c971ca38","components/feedback/StatusBadge.jsx":"47000944a0e4","components/forms/Button.jsx":"8dd1818f5482","components/forms/Checkbox.jsx":"4924994c86a5","components/forms/DateTimeField.jsx":"b3fb65c060c3","components/forms/Field.jsx":"4bb29ec76afe","components/forms/IconButton.jsx":"c4e5dac41090","components/forms/ImageUpload.jsx":"5ff8520803a0","components/forms/Input.jsx":"21d1e03a15c0","components/forms/QuantityStepper.jsx":"c487932b565a","components/forms/RadioGroup.jsx":"36230db5399a","components/forms/SearchField.jsx":"035a6fce9857","components/forms/Select.jsx":"f834f464b844","components/forms/Textarea.jsx":"b46a21e0df83","components/foundation/Icon.jsx":"16cd691a3fef","components/foundation/Logo.jsx":"d85ad4890caf","components/foundation/Media.jsx":"e4e076168326","components/navigation/Breadcrumbs.jsx":"9692288897b0","components/navigation/Pagination.jsx":"46a024a61184","components/navigation/SiteFooter.jsx":"b201b79b9a3e","components/navigation/SiteHeader.jsx":"dd39254d02dc","components/navigation/StaffSidebar.jsx":"32a57c254cfa","components/navigation/StaffTopBar.jsx":"e04ce8c88f50","components/navigation/Tabs.jsx":"1fcf2c6889b7","doc-page.js":"f52ae9c02fca","ui_kits/staff_portal/BookingAdmin.jsx":"a69fddaaa17a","ui_kits/staff_portal/CollectionAdmin.jsx":"046d19483367","ui_kits/staff_portal/DashboardScreen.jsx":"77f44d9e847b","ui_kits/staff_portal/EventAdmin.jsx":"0646cf31afe7","ui_kits/staff_portal/StaffApp.jsx":"fa00cd8e7af0","ui_kits/staff_portal/StaffShell.jsx":"af34ae514887","ui_kits/staff_portal/data.js":"8fef46956b78","ui_kits/visitor_site/AccountScreens.jsx":"6e5ba2b17356","ui_kits/visitor_site/CollectionScreens.jsx":"d03028132feb","ui_kits/visitor_site/EventScreens.jsx":"d63630b09806","ui_kits/visitor_site/HomeScreen.jsx":"405b7c2b7786","ui_kits/visitor_site/Motion.jsx":"6ef07cbdfbe3","ui_kits/visitor_site/Shell.jsx":"4835b4c4b0fb","ui_kits/visitor_site/TicketingScreens.jsx":"43d6f2a02fca","ui_kits/visitor_site/VisitorApp.jsx":"bc7d37c76301","ui_kits/visitor_site/data.js":"af024d59913b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HeritageMuseumDesignSystem_5a5154 = window.HeritageMuseumDesignSystem_5a5154 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  interactive,
  padding = 'var(--space-5)',
  as = 'div',
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid ' + (hover ? 'var(--border-strong)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'var(--transition-surface), border-color var(--duration-fast) var(--ease-out)',
      overflow: 'hidden',
      padding,
      textDecoration: 'none',
      display: 'block',
      cursor: interactive ? 'pointer' : undefined,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Skeleton({
  width = '100%',
  height = 16,
  radius = 'var(--radius-sm)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'block',
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg,var(--paper-100) 25%,var(--paper-200) 37%,var(--paper-100) 63%)',
      backgroundSize: '200% 100%',
      animation: 'hm-shimmer 1.4s ease-in-out infinite',
      ...style
    }
  }, rest));
}
function SkeletonCard({
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    "aria-busy": "true",
    "aria-label": "Loading",
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    height: 150,
    radius: "var(--radius-md)"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "45%",
    height: 12
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "85%",
    height: 18
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "65%",
    height: 12
  }));
}
Object.assign(__ds_scope, { Skeleton, SkeletonCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Shared label + hint + error shell. Every form control in this system is
   labelled — placeholder-only fields are not permitted. */
function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  optional,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)',
      display: 'flex',
      gap: 6,
      alignItems: 'baseline'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--danger-600)'
    }
  }, "*"), optional && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "Optional")), children, hint && !error && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, hint), error && /*#__PURE__*/React.createElement("p", {
    role: "alert",
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--danger-600)',
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u26A0"), error));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function controlStyle({
  invalid,
  focus,
  disabled,
  size = 'md'
}) {
  return {
    width: '100%',
    minHeight: size === 'sm' ? 36 : 44,
    padding: size === 'sm' ? '7px 10px' : '10px 14px',
    font: 'var(--type-body)',
    color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : focus ? 'var(--olive-500)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? invalid ? 'var(--ring-danger)' : 'var(--ring-focus)' : 'none',
    outline: 'none',
    transition: 'var(--transition-control)'
  };
}
function Input({
  invalid,
  size = 'md',
  iconLeft,
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const input = /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    "aria-invalid": invalid || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...controlStyle({
        invalid,
        focus,
        disabled,
        size
      }),
      paddingLeft: iconLeft ? 42 : undefined,
      ...style
    }
  }, rest));
  if (!iconLeft) return input;
  const url = 'url("https://unpkg.com/lucide-static@0.454.0/icons/' + iconLeft + '.svg")';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 18,
      height: 18,
      backgroundColor: 'var(--text-muted)',
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat'
    }
  }), input);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function RadioGroup({
  name,
  options = [],
  value,
  onChange,
  legend,
  direction = 'column',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("fieldset", _extends({
    style: {
      border: 0,
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: 'var(--space-2)',
      ...style
    }
  }, rest), legend && /*#__PURE__*/React.createElement("legend", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)',
      padding: 0,
      marginBottom: 'var(--space-1)'
    }
  }, legend), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 'var(--space-5)' : 'var(--space-1)',
      flexWrap: 'wrap'
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    const on = value === v;
    return /*#__PURE__*/React.createElement("label", {
      key: v,
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
        minHeight: 'var(--touch-target)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: 'var(--border-width-thick) solid ' + (on ? 'var(--action-primary)' : 'var(--border-default)'),
        background: 'var(--surface-card)'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      value: v,
      checked: on,
      onChange: () => onChange && onChange(v),
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0,
        margin: 0,
        cursor: 'pointer'
      }
    }), on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--action-primary)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-heading)'
      }
    }, l));
  })));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function controlStyle({
  invalid,
  focus,
  disabled,
  size = 'md'
}) {
  return {
    width: '100%',
    minHeight: size === 'sm' ? 36 : 44,
    padding: size === 'sm' ? '7px 10px' : '10px 14px',
    font: 'var(--type-body)',
    color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : focus ? 'var(--olive-500)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? invalid ? 'var(--ring-danger)' : 'var(--ring-focus)' : 'none',
    outline: 'none',
    transition: 'var(--transition-control)'
  };
}
function Select({
  options = [],
  invalid,
  size = 'md',
  disabled,
  placeholder,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const url = 'url("https://unpkg.com/lucide-static@0.454.0/icons/chevron-down.svg")';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    "aria-invalid": invalid || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...controlStyle({
        invalid,
        focus,
        disabled,
        size
      }),
      appearance: 'none',
      paddingRight: 40,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
      pointerEvents: 'none',
      backgroundColor: 'var(--text-muted)',
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat'
    }
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function controlStyle({
  invalid,
  focus,
  disabled,
  size = 'md'
}) {
  return {
    width: '100%',
    minHeight: size === 'sm' ? 36 : 44,
    padding: size === 'sm' ? '7px 10px' : '10px 14px',
    font: 'var(--type-body)',
    color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : focus ? 'var(--olive-500)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? invalid ? 'var(--ring-danger)' : 'var(--ring-focus)' : 'none',
    outline: 'none',
    transition: 'var(--transition-control)'
  };
}
function Textarea({
  invalid,
  rows = 4,
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    "aria-invalid": invalid || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...controlStyle({
        invalid,
        focus,
        disabled
      }),
      resize: 'vertical',
      lineHeight: 'var(--leading-relaxed)',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/foundation/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide (lucide.dev, ISC) is used as the Heritage Museum icon set — the brand
   sheet shipped no icon library. Glyphs are pulled from the lucide-static CDN and
   painted with currentColor via a CSS mask so they inherit text colour. */
const CDN = 'https://unpkg.com/lucide-static@0.454.0/icons/';
function Icon({
  name,
  size = 20,
  strokeWidth,
  color = 'currentColor',
  label,
  style,
  ...rest
}) {
  const url = `url("${CDN}${name}.svg")`;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? 'img' : 'presentation',
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      flex: '0 0 auto',
      backgroundColor: color,
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      opacity: strokeWidth === 'light' ? 0.72 : 1,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundation/Icon.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatCard({
  label,
  value,
  delta,
  deltaTone = 'neutral',
  icon,
  footnote,
  style,
  ...rest
}) {
  const tones = {
    up: 'var(--success-600)',
    down: 'var(--danger-600)',
    neutral: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wider)',
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      background: 'var(--olive-50)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 17,
    color: "var(--olive-600)"
  }))), /*#__PURE__*/React.createElement("strong", {
    style: {
      font: 'var(--weight-regular) var(--text-3xl)/1 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, value), (delta || footnote) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'center',
      font: 'var(--type-body-sm)'
    }
  }, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: tones[deltaTone]
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: deltaTone === 'down' ? 'trending-down' : 'trending-up',
    size: 14
  }), delta), footnote && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, footnote)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DataTable({
  columns = [],
  rows = [],
  caption,
  sortKey,
  sortDir = 'asc',
  onSort,
  empty,
  dense,
  style,
  ...rest
}) {
  if (!rows.length && empty) return empty;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      overflowX: 'auto',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      font: 'var(--type-body-sm)'
    }
  }, caption && /*#__PURE__*/React.createElement("caption", {
    style: {
      captionSide: 'top',
      textAlign: 'left',
      padding: 'var(--space-4) var(--space-5)',
      font: 'var(--type-label)',
      color: 'var(--text-muted)'
    }
  }, caption), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => {
    const on = sortKey === c.key;
    return /*#__PURE__*/React.createElement("th", {
      key: c.key,
      scope: "col",
      "aria-sort": on ? sortDir === 'asc' ? 'ascending' : 'descending' : undefined,
      style: {
        textAlign: c.align || 'left',
        padding: dense ? '10px 14px' : '14px 18px',
        background: 'var(--surface-sunken)',
        borderBottom: 'var(--border-width) solid var(--border-subtle)',
        whiteSpace: 'nowrap',
        font: 'var(--weight-semibold) var(--text-xs)/1.2 var(--font-body)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        width: c.width
      }
    }, c.sortable ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onSort && onSort(c.key),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        letterSpacing: 'inherit',
        textTransform: 'inherit',
        color: on ? 'var(--text-heading)' : 'inherit',
        padding: 0
      }
    }, c.header, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: on ? sortDir === 'asc' ? 'arrow-up' : 'arrow-down' : 'chevrons-up-down',
      size: 13
    })) : c.header);
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id || i,
    style: {
      borderBottom: i === rows.length - 1 ? 'none' : 'var(--border-width) solid var(--border-subtle)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      padding: dense ? '10px 14px' : '14px 18px',
      textAlign: c.align || 'left',
      color: 'var(--text-body)',
      verticalAlign: 'middle'
    }
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  info: {
    bg: 'var(--info-100)',
    bd: '#A9C6D6',
    fg: '#2E4C5E',
    icon: 'info'
  },
  success: {
    bg: 'var(--success-100)',
    bd: '#A8CDB4',
    fg: '#2C5C39',
    icon: 'check-circle-2'
  },
  warning: {
    bg: 'var(--warning-100)',
    bd: '#E3C68A',
    fg: '#8A6114',
    icon: 'alert-triangle'
  },
  danger: {
    bg: 'var(--danger-100)',
    bd: '#DFA79D',
    fg: '#8F3124',
    icon: 'alert-circle'
  }
};
function Alert({
  tone = 'info',
  title,
  children,
  onDismiss,
  action,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: tone === 'danger' ? 'alert' : 'status',
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: t.bg,
      border: `var(--border-width) solid ${t.bd}`,
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 20,
    color: t.fg,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      font: 'var(--type-label)',
      color: t.fg
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)'
    }
  }, children), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)'
    }
  }, action)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      padding: 2,
      height: 'fit-content'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16,
    color: t.fg
  })));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  icon = 'search-x',
  title,
  description,
  action,
  compact,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      justifyItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-3)',
      padding: compact ? 'var(--space-8)' : 'var(--space-16) var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px dashed var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--olive-50)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26,
    color: "var(--olive-500)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      maxWidth: 420
    }
  }, description), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)'
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Status is never communicated by colour alone: every badge carries an icon and a word. */
const TONES = {
  neutral: {
    bg: 'var(--paper-100)',
    fg: 'var(--neutral-700)',
    icon: 'circle'
  },
  success: {
    bg: 'var(--success-100)',
    fg: '#2C5C39',
    icon: 'check-circle-2'
  },
  warning: {
    bg: 'var(--warning-100)',
    fg: '#8A6114',
    icon: 'alert-triangle'
  },
  danger: {
    bg: 'var(--danger-100)',
    fg: '#8F3124',
    icon: 'x-circle'
  },
  info: {
    bg: 'var(--info-100)',
    fg: '#2E4C5E',
    icon: 'info'
  },
  member: {
    bg: 'var(--sand-200)',
    fg: 'var(--gold-700)',
    icon: 'award'
  },
  olive: {
    bg: 'var(--olive-100)',
    fg: 'var(--olive-700)',
    icon: 'tag'
  }
};
function StatusBadge({
  children,
  tone = 'neutral',
  icon,
  size = 'md',
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: sm ? '3px 8px' : '5px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      font: `var(--weight-semibold) ${sm ? 'var(--text-2xs)' : 'var(--text-xs)'}/1.2 var(--font-body)`,
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || t.icon,
    size: sm ? 11 : 13
  }), children);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 36,
    padding: '0 14px',
    font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)',
    gap: 6,
    icon: 16
  },
  md: {
    height: 44,
    padding: '0 20px',
    font: 'var(--type-button)',
    gap: 8,
    icon: 18
  },
  lg: {
    height: 52,
    padding: '0 28px',
    font: 'var(--weight-semibold) var(--text-base)/1 var(--font-body)',
    gap: 10,
    icon: 20
  }
};
function palette(variant, state) {
  const p = {
    primary: {
      bg: 'var(--action-primary)',
      fg: 'var(--text-inverse)',
      bd: 'var(--action-primary)',
      hover: 'var(--action-primary-hover)',
      active: 'var(--action-primary-active)'
    },
    secondary: {
      bg: 'transparent',
      fg: 'var(--olive-700)',
      bd: 'var(--olive-500)',
      hover: 'var(--olive-50)',
      active: 'var(--olive-100)'
    },
    accent: {
      bg: 'var(--action-accent)',
      fg: 'var(--green-900)',
      bd: 'var(--action-accent)',
      hover: 'var(--sand-400)',
      active: 'var(--sand-500)'
    },
    ghost: {
      bg: 'transparent',
      fg: 'var(--text-heading)',
      bd: 'transparent',
      hover: 'var(--paper-100)',
      active: 'var(--paper-200)'
    },
    danger: {
      bg: 'var(--danger-600)',
      fg: '#fff',
      bd: 'var(--danger-600)',
      hover: '#8F3124',
      active: '#78281E'
    }
  }[variant] || {};
  if (state === 'hover') return variant === 'secondary' || variant === 'ghost' ? {
    ...p,
    bg: p.hover
  } : {
    ...p,
    bg: p.hover,
    bd: p.hover
  };
  if (state === 'active') return variant === 'secondary' || variant === 'ghost' ? {
    ...p,
    bg: p.active
  } : {
    ...p,
    bg: p.active,
    bd: p.active
  };
  return p;
}
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading,
  disabled,
  fullWidth,
  as = 'button',
  children,
  style,
  ...rest
}) {
  const [state, setState] = React.useState('rest');
  const s = SIZES[size] || SIZES.md;
  const c = palette(variant, disabled ? 'rest' : state);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: Tag === 'button' ? disabled || loading : undefined,
    "aria-busy": loading || undefined,
    "aria-disabled": disabled || undefined,
    onMouseEnter: () => setState('hover'),
    onMouseLeave: () => setState('rest'),
    onMouseDown: () => setState('active'),
    onMouseUp: () => setState('hover'),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      minWidth: s.height,
      font: s.font,
      letterSpacing: '0.02em',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      borderRadius: 'var(--radius-md)',
      border: `var(--border-width) solid ${disabled ? 'transparent' : c.bd}`,
      background: disabled ? 'var(--action-disabled-bg)' : c.bg,
      color: disabled ? 'var(--action-disabled-text)' : c.fg,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }, rest), loading && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "loader-circle",
    size: s.icon,
    style: {
      animation: 'hm-spin 900ms linear infinite'
    }
  }), !loading && iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  checked,
  disabled,
  invalid,
  onChange,
  id,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      minHeight: 'var(--touch-target)',
      padding: '6px 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      width: 20,
      height: 20,
      flex: '0 0 auto',
      marginTop: 2,
      borderRadius: 'var(--radius-sm)',
      border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : checked ? 'var(--action-primary)' : 'var(--border-default)'),
      background: disabled ? 'var(--surface-sunken)' : checked ? 'var(--action-primary)' : 'var(--surface-card)',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: 'inherit'
    }
  }, rest)), checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    color: "var(--paper-50)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/data/FilterPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Group({
  title,
  children,
  defaultOpen = true
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(!open),
    "aria-expanded": open,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minHeight: 44,
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? 'chevron-up' : 'chevron-down',
    size: 16,
    color: "var(--text-muted)"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-1)',
      marginTop: 'var(--space-1)'
    }
  }, children));
}
function FilterPanel({
  groups = [],
  selected = {},
  onToggle,
  sortOptions,
  sort,
  onSort,
  onClear,
  activeCount = 0,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      alignContent: 'start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sliders-horizontal",
    size: 16,
    color: "var(--olive-600)"
  }), "Filters", activeCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--olive-100)',
      color: 'var(--olive-700)'
    }
  }, activeCount)), activeCount > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    style: {
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      font: 'var(--type-body-sm)',
      color: 'var(--text-link)',
      textDecoration: 'underline',
      padding: 4
    }
  }, "Clear all")), sortOptions && /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, "Sort by"), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    options: sortOptions,
    value: sort,
    onChange: e => onSort && onSort(e.target.value),
    size: "sm"
  })), groups.map(g => /*#__PURE__*/React.createElement(Group, {
    key: g.title,
    title: g.title
  }, g.options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    const count = typeof o === 'object' ? o.count : undefined;
    return /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
      key: v,
      id: g.title + '-' + v,
      checked: !!(selected[g.title] || []).includes(v),
      onChange: () => onToggle && onToggle(g.title, v),
      label: /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          gap: 8
        }
      }, l, count != null && /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, "(", count, ")")),
      style: {
        minHeight: 40,
        padding: '2px 0'
      }
    });
  }))));
}
Object.assign(__ds_scope, { FilterPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/FilterPanel.jsx", error: String((e && e.message) || e) }); }

// components/forms/DateTimeField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function controlStyle({
  invalid,
  focus,
  disabled,
  size = 'md'
}) {
  return {
    width: '100%',
    minHeight: size === 'sm' ? 36 : 44,
    padding: size === 'sm' ? '7px 10px' : '10px 14px',
    font: 'var(--type-body)',
    color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : focus ? 'var(--olive-500)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? invalid ? 'var(--ring-danger)' : 'var(--ring-focus)' : 'none',
    outline: 'none',
    transition: 'var(--transition-control)'
  };
}
function DateTimeField({
  type = 'date',
  invalid,
  disabled,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    disabled: disabled,
    "aria-invalid": invalid || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...controlStyle({
        invalid,
        focus,
        disabled
      }),
      paddingRight: 40,
      ...style
    }
  }, rest)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: type === 'time' ? 'clock' : 'calendar-days',
    size: 18,
    color: "var(--text-muted)",
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }));
}
Object.assign(__ds_scope, { DateTimeField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DateTimeField.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 36,
  md: 44,
  lg: 52
};
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  disabled,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const box = SIZES[size] || 44;
  const fills = {
    ghost: {
      bg: hover ? 'var(--paper-100)' : 'transparent',
      fg: 'var(--text-heading)',
      bd: 'transparent'
    },
    outline: {
      bg: hover ? 'var(--olive-50)' : 'var(--surface-card)',
      fg: 'var(--olive-700)',
      bd: 'var(--border-default)'
    },
    solid: {
      bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)',
      fg: 'var(--text-inverse)',
      bd: 'transparent'
    },
    inverse: {
      bg: hover ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.10)',
      fg: 'var(--paper-50)',
      bd: 'var(--border-inverse)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: box,
      height: box,
      display: 'inline-grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-md)',
      border: `var(--border-width) solid ${fills.bd}`,
      background: disabled ? 'var(--action-disabled-bg)' : fills.bg,
      color: disabled ? 'var(--action-disabled-text)' : fills.fg,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 18 : 20
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Drawer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Drawer({
  open = true,
  side = 'right',
  title,
  children,
  footer,
  onClose,
  size = 340,
  style,
  ...rest
}) {
  if (!open) return null;
  const vertical = side === 'bottom';
  return /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      background: 'var(--overlay-scrim)',
      display: 'flex',
      justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
      alignItems: vertical ? 'flex-end' : 'stretch'
    }
  }, /*#__PURE__*/React.createElement("aside", _extends({
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      display: 'flex',
      flexDirection: 'column',
      width: vertical ? '100%' : size,
      maxHeight: vertical ? '82%' : '100%',
      height: vertical ? undefined : '100%',
      borderRadius: vertical ? 'var(--radius-xl) var(--radius-xl) 0 0' : 0,
      boxShadow: 'var(--shadow-xl)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-5)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)',
      flex: 1
    }
  }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-5)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-5)',
      borderTop: 'var(--border-width) solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Drawer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Drawer.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Modal({
  open = true,
  title,
  description,
  children,
  footer,
  onClose,
  width = 520,
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(2px)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      maxHeight: '86%',
      overflow: 'auto',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      padding: 'var(--space-6) var(--space-6) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-6)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-3)',
      padding: 'var(--space-6)',
      marginTop: 'var(--space-2)',
      borderTop: 'var(--border-width) solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/forms/ImageUpload.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ImageUpload({
  fileName,
  previewTone = 'olive',
  hint = 'JPG or PNG, at least 1600px wide, max 5MB',
  onRemove,
  invalid,
  style,
  ...rest
}) {
  const [over, setOver] = React.useState(false);
  if (fileName) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'center',
        padding: 'var(--space-3)',
        border: 'var(--border-width) solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-card)',
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 96,
        height: 72,
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg,#8A9F59,#455326)',
        flex: '0 0 auto'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        color: 'var(--text-heading)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, fileName), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, "Uploaded")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: "trash-2",
      onClick: onRemove
    }, "Remove"));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    onDragOver: e => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: e => {
      e.preventDefault();
      setOver(false);
    },
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      justifyItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-8) var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      border: '2px dashed ' + (invalid ? 'var(--danger-600)' : over ? 'var(--olive-500)' : 'var(--border-default)'),
      background: over ? 'var(--olive-50)' : 'var(--surface-card)',
      transition: 'var(--transition-control)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "image-up",
    size: 28,
    color: "var(--olive-500)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, "Drag an image here, or browse"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, hint)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm"
  }, "Choose file"));
}
Object.assign(__ds_scope, { ImageUpload });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ImageUpload.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function QuantityStepper({
  value = 0,
  min = 0,
  max = 10,
  onChange,
  label = 'Quantity',
  disabled,
  style,
  ...rest
}) {
  const set = v => onChange && onChange(Math.max(min, Math.min(max, v)));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "minus",
    label: `Remove one ${label}`,
    variant: "outline",
    onClick: () => set(value - 1),
    disabled: disabled || value <= min
  }), /*#__PURE__*/React.createElement("input", {
    "aria-label": label,
    value: value,
    readOnly: true,
    inputMode: "numeric",
    style: {
      width: 52,
      height: 44,
      textAlign: 'center',
      font: 'var(--weight-semibold) var(--text-base)/1 var(--font-body)',
      color: 'var(--text-heading)',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-default)',
      borderRadius: 'var(--radius-md)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "plus",
    label: `Add one ${label}`,
    variant: "outline",
    onClick: () => set(value + 1),
    disabled: disabled || value >= max
  }));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchField({
  placeholder = 'Search collections, artefacts, events',
  value,
  onChange,
  onClear,
  size = 'md',
  id = 'search',
  label,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 36 : 44;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    role: "search",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height: h,
      padding: '0 12px',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-pill)',
      border: 'var(--border-width) solid ' + (focus ? 'var(--olive-500)' : 'var(--border-default)'),
      boxShadow: focus ? 'var(--ring-focus)' : 'none',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 18,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: "search",
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    "aria-label": label ? undefined : 'Search',
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 0,
      outline: 'none',
      background: 'transparent',
      font: 'var(--type-body)',
      color: 'var(--text-heading)',
      minWidth: 0
    }
  }, rest)), value ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    "aria-label": "Clear search",
    style: {
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16,
    color: "var(--text-muted)"
  })) : null));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/foundation/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SRC = {
  primary: 'logo-primary.png',
  horizontal: 'logo-lockup-horizontal.png',
  mark: 'logo-mark.png'
};
function Logo({
  variant = 'horizontal',
  height,
  assetBase = '../../assets/',
  href,
  style,
  ...rest
}) {
  const h = height ?? (variant === 'primary' ? 140 : variant === 'mark' ? 40 : 44);
  const img = /*#__PURE__*/React.createElement("img", _extends({
    src: assetBase + SRC[variant],
    alt: "Heritage Museum",
    style: {
      height: h,
      width: 'auto',
      display: 'block',
      ...style
    }
  }, rest));
  return href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      display: 'inline-flex',
      textDecoration: 'none'
    }
  }, img) : img;
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundation/Logo.jsx", error: String((e && e.message) || e) }); }

// components/foundation/Media.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  olive: ['#8A9F59', '#455326'],
  green: ['#3E6B4A', '#14231A'],
  sand: ['#E8CE7C', '#A5851F'],
  stone: ['#B4AF9E', '#4A473D']
};

/* Stand-in for museum photography. Swap the placeholder for a real <img> when
   artefact photography is available — the ratio, radius and scrim stay the same. */
function Media({
  src,
  alt = '',
  ratio = '4 / 3',
  tone = 'olive',
  caption,
  radius = 'var(--radius-lg)',
  scrim = false,
  children,
  style,
  ...rest
}) {
  const [a, b] = TONES[tone] || TONES.olive;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      aspectRatio: ratio,
      overflow: 'hidden',
      borderRadius: radius,
      background: src ? 'var(--surface-sunken)' : `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.82)'
    }
  }, caption || alt || 'Museum photography')), scrim && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-image)'
    }
  }), children && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, children));
}
Object.assign(__ds_scope, { Media });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundation/Media.jsx", error: String((e && e.message) || e) }); }

// components/cards/CollectionCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CollectionCard({
  name,
  category,
  period,
  description,
  itemCount,
  image,
  tone = 'olive',
  href = '#',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    interactive: true,
    as: "a",
    href: href,
    padding: 0,
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Media, {
    src: image,
    ratio: "4 / 3",
    tone: tone,
    caption: name,
    radius: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      padding: 'var(--space-4) var(--space-5) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, category && /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    tone: "olive",
    size: "sm"
  }, category), period && /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    tone: "neutral",
    size: "sm",
    icon: "hourglass"
  }, period)), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)',
      color: 'var(--text-heading)'
    }
  }, name), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description), itemCount != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-accent)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, itemCount, " objects")));
}
Object.assign(__ds_scope, { CollectionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CollectionCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/EventCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AVAIL = {
  available: {
    tone: 'success',
    label: 'Tickets available'
  },
  limited: {
    tone: 'warning',
    label: 'Limited availability'
  },
  soldout: {
    tone: 'danger',
    label: 'Sold out'
  },
  cancelled: {
    tone: 'danger',
    label: 'Cancelled'
  }
};
function Meta({
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15,
    color: "var(--olive-500)"
  }), children);
}
function EventCard({
  title,
  description,
  date,
  time,
  location,
  price,
  free,
  availability = 'available',
  image,
  layout = 'vertical',
  href = '#',
  onBook,
  style,
  ...rest
}) {
  const a = AVAIL[availability] || AVAIL.available;
  const blocked = availability === 'soldout' || availability === 'cancelled';
  const row = layout === 'horizontal';
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    padding: 0,
    interactive: !blocked,
    style: {
      display: row ? 'grid' : 'block',
      gridTemplateColumns: row ? '260px minmax(0,1fr)' : undefined,
      ...style
    }
  }, rest), row ? /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Media, {
    src: image,
    ratio: "auto",
    tone: "green",
    caption: title,
    radius: "0",
    style: {
      width: '100%',
      height: '100%',
      aspectRatio: 'auto',
      minHeight: 200
    }
  })) : /*#__PURE__*/React.createElement(__ds_scope.Media, {
    src: image,
    ratio: "16 / 9",
    tone: "green",
    caption: title,
    radius: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      padding: 'var(--space-5)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    tone: a.tone,
    size: "sm"
  }, a.label), free && /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    tone: "info",
    size: "sm",
    icon: "gift"
  }, "Free")), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-5)'
    }
  }, date && /*#__PURE__*/React.createElement(Meta, {
    icon: "calendar-days"
  }, date), time && /*#__PURE__*/React.createElement(Meta, {
    icon: "clock"
  }, time), location && /*#__PURE__*/React.createElement(Meta, {
    icon: "map-pin"
  }, location)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-md)/1 var(--font-body)',
      color: 'var(--text-heading)'
    }
  }, free ? 'Free entry' : price), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: blocked ? 'secondary' : 'primary',
    size: "sm",
    disabled: blocked,
    onClick: onBook,
    as: blocked ? 'button' : 'a',
    href: blocked ? undefined : href
  }, availability === 'cancelled' ? 'Event cancelled' : availability === 'soldout' ? 'Join waiting list' : free ? 'Reserve a place' : 'Book tickets'))));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ItemCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ItemCard({
  name,
  period,
  date,
  description,
  image,
  href = '#',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    interactive: true,
    as: "a",
    href: href,
    padding: 0,
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Media, {
    src: image,
    ratio: "1 / 1",
    tone: "stone",
    caption: name,
    radius: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6,
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--weight-medium) var(--text-md)/var(--leading-snug) var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, name), (period || date) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-accent)',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, [period, date].filter(Boolean).join(' · ')), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description)));
}
Object.assign(__ds_scope, { ItemCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ItemCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/RecommendationCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The reason line explains a recommendation in human terms ("Because you explored
   Prehistory") — never expose scoring, models or technical logic to visitors. */
function RecommendationCard({
  title,
  kind = 'Collection',
  reason,
  image,
  tone = 'olive',
  href = '#',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    interactive: true,
    as: "a",
    href: href,
    padding: 0,
    style: {
      display: 'grid',
      gridTemplateColumns: '104px minmax(0,1fr)',
      alignItems: 'stretch',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Media, {
    src: image,
    ratio: "auto",
    tone: tone,
    caption: title,
    radius: "0",
    style: {
      width: '100%',
      height: '100%',
      aspectRatio: 'auto',
      minHeight: 104
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      padding: 'var(--space-4)',
      alignContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wider)',
      color: 'var(--text-muted)'
    }
  }, kind), /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--weight-medium) var(--text-md)/var(--leading-snug) var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, title), reason && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center',
      font: 'var(--type-body-sm)',
      color: 'var(--text-accent)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkles",
    size: 14
  }), reason)));
}
Object.assign(__ds_scope, { RecommendationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/RecommendationCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumbs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumbs({
  items = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Breadcrumb",
    style: style
  }, rest), /*#__PURE__*/React.createElement("ol", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-2)',
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, items.map((it, i) => {
    const label = typeof it === 'string' ? it : it.label;
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: label,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }
    }, last ? /*#__PURE__*/React.createElement("span", {
      "aria-current": "page",
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-heading)',
        fontWeight: 'var(--weight-semibold)'
      }
    }, label) : /*#__PURE__*/React.createElement("a", {
      href: typeof it === 'object' && it.href || '#',
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)',
        textDecoration: 'none'
      }
    }, label), !last && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 14,
      color: "var(--neutral-400)"
    }));
  })));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pagination({
  page = 1,
  pages = 1,
  onChange,
  showLoadMore,
  onLoadMore,
  resultLabel,
  style,
  ...rest
}) {
  if (showLoadMore) {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'grid',
        justifyItems: 'center',
        gap: 'var(--space-3)',
        ...style
      }
    }, rest), resultLabel && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, resultLabel), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onLoadMore,
      style: {
        minHeight: 44,
        padding: '0 28px',
        borderRadius: 'var(--radius-pill)',
        border: 'var(--border-width) solid var(--olive-500)',
        background: 'transparent',
        color: 'var(--olive-700)',
        font: 'var(--type-button)',
        cursor: 'pointer'
      }
    }, "Load more"));
  }
  const nums = Array.from({
    length: pages
  }, (_, i) => i + 1).filter(n => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const cell = (content, key, opts = {}) => /*#__PURE__*/React.createElement("button", {
    key: key,
    type: "button",
    disabled: opts.disabled,
    onClick: opts.onClick,
    "aria-current": opts.current ? 'page' : undefined,
    style: {
      minWidth: 44,
      height: 44,
      padding: '0 10px',
      borderRadius: 'var(--radius-md)',
      cursor: opts.disabled ? 'not-allowed' : 'pointer',
      border: 'var(--border-width) solid ' + (opts.current ? 'var(--action-primary)' : 'var(--border-default)'),
      background: opts.current ? 'var(--action-primary)' : 'var(--surface-card)',
      color: opts.disabled ? 'var(--action-disabled-text)' : opts.current ? 'var(--text-inverse)' : 'var(--text-heading)',
      font: 'var(--type-button)',
      display: 'grid',
      placeItems: 'center',
      transition: 'var(--transition-control)'
    }
  }, content);
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Pagination",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      flexWrap: 'wrap',
      ...style
    }
  }, rest), cell(/*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-left",
    size: 18
  }), 'prev', {
    disabled: page === 1,
    onClick: () => onChange && onChange(page - 1)
  }), nums.map((n, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: n
  }, i > 0 && n - nums[i - 1] > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      padding: '0 4px'
    }
  }, "\u2026"), cell(n, n, {
    current: n === page,
    onClick: () => onChange && onChange(n)
  }))), cell(/*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18
  }), 'next', {
    disabled: page === pages,
    onClick: () => onChange && onChange(page + 1)
  }));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COLUMNS = [{
  title: 'Visit',
  links: ['Plan your visit', 'Opening hours', 'Getting here', 'Accessibility', 'Families']
}, {
  title: 'Explore',
  links: ['Collections', 'What\u2019s on', 'Membership', 'Learning', 'Support us']
}, {
  title: 'About',
  links: ['Our story', 'Press', 'Work with us', 'Contact']
}];
function SiteFooter({
  columns = COLUMNS,
  assetBase = '../../assets/',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--paper-100)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-16) var(--container-pad-desktop) var(--space-8)',
      display: 'grid',
      gap: 'var(--space-12)',
      gridTemplateColumns: 'minmax(220px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(180px, 1fr)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "mark",
    height: 52,
    assetBase: assetBase
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'rgba(245,243,233,.72)',
      maxWidth: 260
    }
  }, "Our past. Our stories. Our future."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, ['instagram', 'facebook', 'youtube'].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    "aria-label": s,
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: 'var(--border-width) solid var(--border-inverse)',
      color: 'var(--sand-300)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s,
    size: 18
  }))))), columns.map(c => /*#__PURE__*/React.createElement("nav", {
    key: c.title,
    "aria-label": c.title,
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--type-eyebrow)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wider)',
      color: 'var(--sand-300)'
    }
  }, c.title), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      font: 'var(--type-body-sm)',
      color: 'rgba(245,243,233,.8)',
      textDecoration: 'none'
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--type-eyebrow)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wider)',
      color: 'var(--sand-300)'
    }
  }, "Opening hours"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'rgba(245,243,233,.8)'
    }
  }, "Mon\u2013Fri 10:00\u201317:30", /*#__PURE__*/React.createElement("br", null), "Sat\u2013Sun 09:30\u201318:00", /*#__PURE__*/React.createElement("br", null), "Last entry 45 minutes before close"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'rgba(245,243,233,.8)'
    }
  }, "18 Lanthorn Street", /*#__PURE__*/React.createElement("br", null), "hello@heritagemuseum.org", /*#__PURE__*/React.createElement("br", null), "+44 20 7946 0102"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--border-width) solid var(--border-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-5) var(--container-pad-desktop)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-5)',
      justifyContent: 'space-between',
      font: 'var(--type-body-sm)',
      color: 'rgba(245,243,233,.6)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Heritage Museum"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      flexWrap: 'wrap'
    }
  }, ['Privacy', 'Terms', 'Accessibility statement', 'Cookies'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'rgba(245,243,233,.72)',
      textDecoration: 'none'
    }
  }, l))))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_NAV = ['Home', 'Collections', 'Events', 'Visit', 'Tickets', 'Membership'];
function useMode(mode) {
  const [auto, setAuto] = React.useState('desktop');
  React.useEffect(() => {
    if (mode !== 'auto') return undefined;
    const read = () => setAuto(window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1100 ? 'tablet' : 'desktop');
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [mode]);
  return mode === 'auto' ? auto : mode;
}
function SiteHeader({
  mode = 'auto',
  items = DEFAULT_NAV,
  active = 'Home',
  user,
  isMember,
  assetBase = '../../assets/',
  onNavigate,
  onSearch,
  onMenu,
  onSignIn,
  style,
  ...rest
}) {
  const m = useMode(mode);
  const visible = m === 'desktop' ? items : m === 'tablet' ? items.slice(0, 4) : [];
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'var(--surface-card)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      height: m === 'mobile' ? 'var(--header-h-mobile)' : 'var(--header-h-desktop)',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: `0 ${m === 'mobile' ? 'var(--container-pad-mobile)' : m === 'tablet' ? 'var(--container-pad-tablet)' : 'var(--container-pad-desktop)'}`
    }
  }, m === 'mobile' && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "menu",
    label: "Open menu",
    onClick: onMenu
  }), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: m === 'mobile' ? 'mark' : 'horizontal',
    height: m === 'mobile' ? 34 : 42,
    assetBase: assetBase,
    href: "#"
  }), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Main",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      flex: 1,
      marginLeft: 'var(--space-4)'
    }
  }, visible.map(label => {
    const on = label === active;
    return /*#__PURE__*/React.createElement("a", {
      key: label,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(label);
      },
      "aria-current": on ? 'page' : undefined,
      style: {
        font: 'var(--weight-' + (on ? 'semibold' : 'medium') + ') var(--text-sm)/1 var(--font-body)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: on ? 'var(--green-900)' : 'var(--text-body)',
        paddingBottom: 4,
        borderBottom: '2px solid ' + (on ? 'var(--olive-500)' : 'transparent'),
        transition: 'var(--transition-control)',
        whiteSpace: 'nowrap'
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "search",
    label: "Search",
    onClick: onSearch
  }), user ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onNavigate && onNavigate('Profile'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height: 44,
      padding: '0 8px 0 6px',
      border: 0,
      background: 'transparent',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--green-900)',
      color: 'var(--sand-300)',
      font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)'
    }
  }, user.initials), m !== 'mobile' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      textAlign: 'left',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, user.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: isMember ? 'var(--gold-700)' : 'var(--text-muted)'
    }
  }, isMember ? 'Member' : 'Account')), m !== 'mobile' && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--text-muted)"
  })) : m === 'mobile' ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "user",
    label: "Sign in",
    onClick: onSignIn
  }) : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onSignIn
  }, "Sign in"), m === 'desktop' && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    iconLeft: "ticket",
    onClick: () => onNavigate && onNavigate('Tickets')
  }, "Book tickets"))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StaffSidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_SECTIONS = [{
  title: 'Overview',
  items: [{
    label: 'Dashboard',
    icon: 'layout-dashboard'
  }]
}, {
  title: 'Content',
  items: [{
    label: 'Collections',
    icon: 'library-big'
  }, {
    label: 'Items',
    icon: 'gem'
  }, {
    label: 'Categories',
    icon: 'tags'
  }]
}, {
  title: 'Programme',
  items: [{
    label: 'Events',
    icon: 'calendar-days'
  }, {
    label: 'Tickets',
    icon: 'ticket'
  }, {
    label: 'Bookings',
    icon: 'receipt'
  }]
}, {
  title: 'Admin',
  items: [{
    label: 'Staff & roles',
    icon: 'shield-check'
  }]
}];
function StaffSidebar({
  sections = DEFAULT_SECTIONS,
  active = 'Dashboard',
  collapsed = false,
  onNavigate,
  assetBase = '../../assets/',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("aside", _extends({
    style: {
      width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
      flex: '0 0 auto',
      background: 'var(--surface-staff-nav)',
      color: 'var(--paper-100)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      padding: 'var(--space-5) var(--space-3)',
      height: '100%',
      overflow: 'auto',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: '0 var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "mark",
    height: 34,
    assetBase: assetBase
  }), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-md)/1 var(--font-display)',
      color: 'var(--paper-50)'
    }
  }, "Heritage"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--sand-300)'
    }
  }, "Staff portal"))), sections.map(s => /*#__PURE__*/React.createElement("nav", {
    key: s.title,
    "aria-label": s.title,
    style: {
      display: 'grid',
      gap: 2
    }
  }, !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'rgba(242,226,166,.55)',
      padding: '0 var(--space-3) var(--space-2)'
    }
  }, s.title), s.items.map(it => {
    const on = it.label === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it.label,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(it.label);
      },
      "aria-current": on ? 'page' : undefined,
      title: collapsed ? it.label : undefined,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 42,
        padding: collapsed ? '0 var(--space-3)' : '0 var(--space-3)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        background: on ? 'rgba(242,226,166,.14)' : 'transparent',
        color: on ? 'var(--sand-300)' : 'rgba(245,243,233,.82)',
        font: 'var(--weight-' + (on ? 'semibold' : 'regular') + ') var(--text-sm)/1 var(--font-body)',
        boxShadow: on ? 'inset 2px 0 0 var(--sand-300)' : 'none',
        transition: 'var(--transition-control)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 18
    }), !collapsed && it.label);
  }))));
}
Object.assign(__ds_scope, { StaffSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StaffSidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StaffTopBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StaffTopBar({
  title,
  subtitle,
  actions,
  user = {
    name: 'R. Syed',
    role: 'Collection Manager',
    initials: 'RS'
  },
  onMenu,
  showMenu,
  showSearch = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      padding: 'var(--space-4) var(--space-6)',
      background: 'var(--surface-card)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      ...style
    }
  }, rest), showMenu && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "menu",
    label: "Open navigation",
    onClick: onMenu
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2,
      marginRight: 'auto',
      minWidth: 160
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--weight-medium) var(--text-xl)/1.2 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, subtitle)), showSearch && /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    placeholder: "Search the portal",
    style: {
      width: 240
    },
    id: "staff-search"
  }), actions, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "bell",
    label: "Notifications"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      paddingLeft: 'var(--space-3)',
      borderLeft: 'var(--border-width) solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--olive-100)',
      color: 'var(--olive-700)',
      font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)'
    }
  }, user.initials), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, user.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, user.role)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--text-muted)"
  })));
}
Object.assign(__ds_scope, { StaffTopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StaffTopBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: variant === 'pill' ? 'var(--space-2)' : 'var(--space-6)',
      borderBottom: variant === 'underline' ? 'var(--border-width) solid var(--border-subtle)' : 'none',
      overflowX: 'auto',
      ...style
    }
  }, rest), items.map(it => {
    const v = typeof it === 'string' ? it : it.value;
    const l = typeof it === 'string' ? it : it.label;
    const count = typeof it === 'object' ? it.count : undefined;
    const on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      type: "button",
      onClick: () => onChange && onChange(v),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        minHeight: 44,
        padding: variant === 'pill' ? '0 16px' : '0 0 12px',
        border: 0,
        background: variant === 'pill' ? on ? 'var(--green-900)' : 'var(--paper-100)' : 'transparent',
        borderRadius: variant === 'pill' ? 'var(--radius-pill)' : 0,
        borderBottom: variant === 'underline' ? '2px solid ' + (on ? 'var(--olive-500)' : 'transparent') : undefined,
        marginBottom: variant === 'underline' ? -1 : 0,
        color: variant === 'pill' ? on ? 'var(--text-inverse)' : 'var(--text-body)' : on ? 'var(--green-900)' : 'var(--text-muted)',
        font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)',
        transition: 'var(--transition-control)'
      }
    }, l, count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
        padding: '3px 6px',
        borderRadius: 'var(--radius-pill)',
        background: on && variant === 'pill' ? 'rgba(255,255,255,.18)' : 'var(--paper-200)',
        color: on && variant === 'pill' ? 'var(--paper-50)' : 'var(--text-muted)'
      }
    }, count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    /* Monolithic at print: Blink slices a transform-scaled child at
     * fragmentainer boundaries mapped in UNSCALED layout coordinates
     * (transforms are paint-time), so the .fit box (authored size, e.g.
     * 1400x990) gets cut at the page's free block space and spills onto
     * a second sheet even though its SCALED footprint fits the page by
     * construction. overflow:hidden makes .fit-box a scroll container —
     * monolithic under fragmentation (css-break-3) — so the scaled
     * content prints atomically on one sheet. No clipping for content
     * within the authored box: .fit-box is calc-sized to exactly the
     * scaled footprint. (Content that bleeds past content-width/height
     * is clipped at the footprint — fit mode's contract; it previously
     * painted beyond it at print.) Print-only, so the screen rendering
     * keeps visible overflow for editor affordances.
     * The export path injects the same rule into frozen copies
     * (print-eval.ts om-print-fit-contain). The .fit-mode scope is
     * load-bearing: .fit-box wraps slotted content in EVERY mode, and an
     * unscoped overflow:hidden would make whole flowing documents
     * monolithic (one truncated sheet). overflow:hidden, never clip —
     * clip is not a scroll container, so not monolithic. */
    @media print {
      .fit-mode .fit-box { overflow: hidden; }
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "doc-page.js", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/BookingAdmin.jsx
try { (() => {
const {
  Button,
  DataTable,
  SearchField,
  Select,
  Tabs,
  Modal,
  Field,
  Input,
  Icon,
  StatusBadge,
  Checkbox,
  EmptyState
} = window.HeritageMuseumDesignSystem_5a5154;
function BookingsScreen({
  mode,
  nav
}) {
  const [tab, setTab] = React.useState('all');
  const rows = window.HMS.bookings.filter(b => tab === 'all' || b.status.toLowerCase() === tab);
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Bookings",
    subtitle: "1,284 bookings \xB7 \xA318,420 taken this month",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "download"
    }, "Export")
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(Toolbar, {
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    value: tab,
    onChange: setTab,
    items: [{
      value: 'all',
      label: 'All',
      count: 5
    }, {
      value: 'confirmed',
      label: 'Confirmed',
      count: 3
    }, {
      value: 'pending',
      label: 'Pending',
      count: 1
    }, {
      value: 'cancelled',
      label: 'Cancelled',
      count: 1
    }]
  }), /*#__PURE__*/React.createElement(SearchField, {
    id: "b-q",
    size: "sm",
    placeholder: "Search by reference or name",
    style: {
      flex: '1 1 220px',
      maxWidth: 300,
      marginLeft: 'auto'
    }
  })), rows.length ? /*#__PURE__*/React.createElement(DataTable, {
    sortKey: "date",
    sortDir: "desc",
    columns: [{
      key: 'id',
      header: 'Booking',
      render: r => /*#__PURE__*/React.createElement("code", {
        style: {
          font: '400 12px var(--font-mono)',
          color: 'var(--text-heading)'
        }
      }, r.id)
    }, {
      key: 'customer',
      header: 'Customer',
      sortable: true
    }, {
      key: 'event',
      header: 'Event'
    }, {
      key: 'qty',
      header: 'Tickets',
      align: 'right'
    }, {
      key: 'date',
      header: 'Booked',
      sortable: true
    }, {
      key: 'total',
      header: 'Total',
      align: 'right'
    }, {
      key: 'payment',
      header: 'Payment',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.payment
      })
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }],
    rows: rows
  }) : /*#__PURE__*/React.createElement(EmptyState, {
    compact: true,
    title: "No bookings in this state",
    description: "Try another tab."
  })));
}
function StaffRolesScreen({
  mode,
  nav
}) {
  const [role, setRole] = React.useState(null);
  const S = window.HMS;
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Staff & roles",
    subtitle: "Four staff accounts \xB7 four roles",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "user-plus"
    }, "Invite staff")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1.4fr 1fr' : '1fr',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Staff accounts"
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: 'name',
      header: 'Person',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          placeItems: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--olive-100)',
          color: 'var(--olive-700)',
          font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)'
        }
      }, r.name.split(' ').map(w => w[0]).join('')), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          gap: 1
        }
      }, /*#__PURE__*/React.createElement("strong", {
        style: {
          font: 'var(--type-label)',
          color: 'var(--text-heading)'
        }
      }, r.name), /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, r.email)))
    }, {
      key: 'role',
      header: 'Role',
      render: r => /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => setRole(S.roles.find(x => x.name === r.role)),
        style: {
          border: 0,
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          font: 'inherit'
        }
      }, /*#__PURE__*/React.createElement(StatusBadge, {
        size: "sm",
        tone: "olive",
        icon: "shield-check"
      }, r.role))
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }, {
      key: 'last',
      header: 'Last active'
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: "pencil"
      }, "Change role")
    }],
    rows: S.staff
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Roles",
    description: "Permissions are attached to roles, not people"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, S.roles.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.name,
    type: "button",
    onClick: () => setRole(r),
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      textAlign: 'left',
      padding: 'var(--space-4)',
      cursor: 'pointer',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, r.people, " person")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, r.permissions.slice(0, 3).map(p => /*#__PURE__*/React.createElement("code", {
    key: p,
    style: {
      font: '400 11px/1.6 var(--font-mono)',
      padding: '2px 6px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--olive-50)',
      color: 'var(--olive-700)'
    }
  }, p)), r.permissions.length > 3 && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "+", r.permissions.length - 3, " more"))))))), /*#__PURE__*/React.createElement(Modal, {
    open: !!role,
    onClose: () => setRole(null),
    title: role ? role.name : '',
    description: "Everyone with this role can do the following.",
    width: 480,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setRole(null)
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setRole(null)
    }, "Save permissions"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      paddingBottom: 'var(--space-4)'
    }
  }, role && ['collection.create', 'collection.edit', 'item.manage', 'category.manage', 'event.create', 'event.edit', 'event.cancel', 'ticket.manage', 'booking.view', 'staff.manage'].map(p => /*#__PURE__*/React.createElement(Checkbox, {
    key: p,
    id: 'perm-' + p,
    checked: role.permissions.some(x => x === p || x.endsWith('.*') && p.startsWith(x.slice(0, -2))),
    onChange: () => {},
    label: /*#__PURE__*/React.createElement("code", {
      style: {
        font: '400 12px var(--font-mono)'
      }
    }, p)
  })))));
}
Object.assign(window, {
  BookingsScreen,
  StaffRolesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/BookingAdmin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/CollectionAdmin.jsx
try { (() => {
const {
  Button,
  DataTable,
  SearchField,
  Select,
  Field,
  Input,
  Textarea,
  ImageUpload,
  RadioGroup,
  Modal,
  StatusBadge,
  Pagination,
  EmptyState,
  Icon,
  Checkbox
} = window.HeritageMuseumDesignSystem_5a5154;
function CollectionsAdminScreen({
  mode,
  nav
}) {
  const S = window.HMS;
  const [q, setQ] = React.useState('');
  const rows = S.collections.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Collections",
    subtitle: "11 collections \xB7 3 drafts",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus",
      onClick: () => nav.go('CollectionForm')
    }, "Create collection")
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(Toolbar, {
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    id: "c-q",
    size: "sm",
    value: q,
    onChange: e => setQ(e.target.value),
    onClear: () => setQ(''),
    placeholder: "Search collections",
    style: {
      flex: '1 1 240px',
      maxWidth: 320
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "All categories",
    options: S.categories.map(c => c.name),
    style: {
      width: 170
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "All statuses",
    options: ['Draft', 'Published', 'Archived'],
    style: {
      width: 150
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: "download",
    style: {
      marginLeft: 'auto'
    }
  }, "Export CSV")), rows.length ? /*#__PURE__*/React.createElement(DataTable, {
    sortKey: "updated",
    sortDir: "desc",
    columns: [{
      key: 'name',
      header: 'Collection',
      sortable: true,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("strong", {
        style: {
          font: 'var(--type-label)',
          color: 'var(--text-heading)'
        }
      }, r.name), /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, r.location))
    }, {
      key: 'category',
      header: 'Category',
      render: r => /*#__PURE__*/React.createElement(StatusBadge, {
        size: "sm",
        tone: "olive"
      }, r.category)
    }, {
      key: 'items',
      header: 'Items',
      align: 'right',
      sortable: true
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }, {
      key: 'updated',
      header: 'Last updated',
      sortable: true
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(RowActions, {
        onEdit: () => nav.go('CollectionForm')
      })
    }],
    rows: rows
  }) : /*#__PURE__*/React.createElement(EmptyState, {
    title: "No collections match",
    description: "Try a different search term.",
    compact: true
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: 1,
    pages: 3,
    style: {
      marginTop: 'var(--space-5)',
      justifyContent: 'flex-end'
    }
  })));
}
function CollectionFormScreen({
  mode,
  nav
}) {
  const S = window.HMS;
  const [newCat, setNewCat] = React.useState(false);
  const [status, setStatus] = React.useState('Draft');
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Collections'
    },
    title: "Edit collection",
    subtitle: "The Lanthorn Hoard \xB7 last saved 4 days ago",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => nav.go('Collections')
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "Save draft"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "upload"
    }, "Publish"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1fr 320px' : '1fr',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Details"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Collection name",
    htmlFor: "f-n",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-n",
    defaultValue: "The Lanthorn Hoard"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Description",
    htmlFor: "f-d",
    required: true,
    hint: "Shown on the public collection page."
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "f-d",
    rows: 5,
    defaultValue: "Ninety-two objects buried together in the third century BCE and found by a farmer in 1974."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Category",
    htmlFor: "f-c",
    required: true,
    hint: newCat ? undefined : 'Categories are managed in Category management.'
  }, newCat ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-c",
    placeholder: "New category name",
    autoFocus: true
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => setNewCat(false)
  }, "Add")) : /*#__PURE__*/React.createElement(Select, {
    id: "f-c",
    options: S.categories.map(c => c.name),
    defaultValue: "Archaeology"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Historical period",
    htmlFor: "f-p"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "f-p",
    options: ['Prehistoric', 'Ancient', 'Medieval', 'Early modern', 'Modern'],
    defaultValue: "Ancient"
  }))), !newCat && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: "plus",
    onClick: () => setNewCat(true)
  }, "Create a new category"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Gallery location",
    htmlFor: "f-l"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-l",
    defaultValue: "Gallery 4 \xB7 First floor"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Entry price",
    htmlFor: "f-pr",
    optional: true,
    hint: "Leave empty for free entry."
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-pr",
    placeholder: "\xA30.00"
  }))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Cover image",
    description: "Used on cards, the collection page and search results"
  }, /*#__PURE__*/React.createElement(ImageUpload, {
    fileName: "lanthorn-hoard-hero.jpg"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Publishing"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "st",
    legend: "Status",
    value: status,
    onChange: setStatus,
    options: ['Draft', 'Published', 'Archived']
  }), /*#__PURE__*/React.createElement(Checkbox, {
    id: "feat",
    label: "Feature on the home page",
    description: "Shows in Featured collections."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      paddingTop: 'var(--space-3)',
      borderTop: '1px solid var(--border-subtle)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Created 3 Feb 2024 by Naomi Vale"), /*#__PURE__*/React.createElement("span", null, "Last published 22 Aug 2026")))), /*#__PURE__*/React.createElement(Panel, {
    title: "Items",
    description: "92 objects in this collection",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => nav.go('Items')
    }, "Manage")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, window.HMS.items.slice(0, 3).map(i => /*#__PURE__*/React.createElement("div", {
    key: i.id,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-sm)',
      background: 'linear-gradient(135deg,#B4AF9E,#4A473D)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, i.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, i.date)))))))));
}
function ItemsAdminScreen({
  mode,
  nav
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Collection items",
    subtitle: "The Lanthorn Hoard \xB7 92 objects",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus",
      onClick: () => setOpen(true)
    }, "Add item")
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(Toolbar, {
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    id: "i-q",
    size: "sm",
    placeholder: "Search items",
    style: {
      flex: '1 1 240px',
      maxWidth: 320
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "All collections",
    options: window.HMS.collections.map(c => c.name),
    style: {
      width: 200
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "All periods",
    options: ['Prehistoric', 'Ancient', 'Medieval'],
    style: {
      width: 150
    }
  })), /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: 'name',
      header: 'Item',
      sortable: true,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 34,
          height: 34,
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg,#B4AF9E,#4A473D)',
          flex: '0 0 auto'
        }
      }), /*#__PURE__*/React.createElement("strong", {
        style: {
          font: 'var(--type-label)',
          color: 'var(--text-heading)'
        }
      }, r.name))
    }, {
      key: 'period',
      header: 'Period'
    }, {
      key: 'date',
      header: 'Date'
    }, {
      key: 'location',
      header: 'Location'
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(RowActions, {
        onEdit: () => setOpen(true),
        destructive: "Remove"
      })
    }],
    rows: window.HMS.items
  })), /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: () => setOpen(false),
    title: "Add an item",
    description: "Items belong to one collection and inherit its category unless you change it.",
    width: 620,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setOpen(false)
    }, "Save item"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Item name",
    htmlFor: "m-n",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "m-n",
    placeholder: "Bronze ceremonial helmet"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Description",
    htmlFor: "m-d"
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "m-d",
    rows: 3
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Related collection",
    htmlFor: "m-c",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    id: "m-c",
    options: window.HMS.collections.map(c => c.name)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Category",
    htmlFor: "m-cat"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "m-cat",
    options: window.HMS.categories.map(c => c.name)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Historical period",
    htmlFor: "m-p"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "m-p",
    options: ['Prehistoric', 'Ancient', 'Medieval']
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Approximate date",
    htmlFor: "m-dt"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "m-dt",
    placeholder: "c. 300 BCE"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Origin",
    htmlFor: "m-o"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "m-o",
    placeholder: "Lanthorn Fields, Kent"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Display location",
    htmlFor: "m-l"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "m-l",
    placeholder: "Case 4A"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Image",
    htmlFor: "m-i"
  }, /*#__PURE__*/React.createElement(ImageUpload, null)))));
}
function CategoriesScreen({
  mode,
  nav
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Categories",
    subtitle: "Categories drive public filtering \u2014 add them here, never in code",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus",
      onClick: () => setOpen(true)
    }, "Create category")
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: 'name',
      header: 'Category',
      sortable: true,
      render: r => /*#__PURE__*/React.createElement("strong", {
        style: {
          font: 'var(--type-label)',
          color: 'var(--text-heading)'
        }
      }, r.name)
    }, {
      key: 'collections',
      header: 'Collections',
      align: 'right'
    }, {
      key: 'items',
      header: 'Items',
      align: 'right'
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(RowActions, {
        onEdit: () => setOpen(true)
      })
    }],
    rows: window.HMS.categories
  })), /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: () => setOpen(false),
    title: "Create a category",
    width: 460,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setOpen(false)
    }, "Create category"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Category name",
    htmlFor: "cat-n",
    required: true,
    hint: "Appears in public filters straight away."
  }, /*#__PURE__*/React.createElement(Input, {
    id: "cat-n",
    placeholder: "Natural History"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Short description",
    htmlFor: "cat-d",
    optional: true
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "cat-d",
    rows: 2
  })))));
}
Object.assign(window, {
  CollectionsAdminScreen,
  CollectionFormScreen,
  ItemsAdminScreen,
  CategoriesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/CollectionAdmin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/DashboardScreen.jsx
try { (() => {
const {
  StatCard,
  Button,
  DataTable,
  Icon,
  EmptyState,
  Alert
} = window.HeritageMuseumDesignSystem_5a5154;
function QuickActions({
  mode,
  nav
}) {
  const actions = [{
    label: 'Create collection',
    icon: 'library-big',
    to: 'CollectionForm'
  }, {
    label: 'Create event',
    icon: 'calendar-plus',
    to: 'EventForm'
  }, {
    label: 'Add item',
    icon: 'gem',
    to: 'Items'
  }, {
    label: 'Manage tickets',
    icon: 'ticket',
    to: 'Tickets'
  }];
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Quick actions"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr 1fr' : 'repeat(4,1fr)',
      gap: 'var(--space-3)'
    }
  }, actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    type: "button",
    onClick: () => nav.go(a.to),
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      justifyItems: 'center',
      textAlign: 'center',
      minHeight: 96,
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-sunken)',
      cursor: 'pointer',
      font: 'var(--weight-semibold) var(--text-sm)/1.3 var(--font-body)',
      color: 'var(--text-heading)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 22,
    color: "var(--olive-600)"
  }), a.label))));
}
function DashboardScreen({
  mode,
  nav
}) {
  const S = window.HMS;
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Dashboard",
    subtitle: "Wednesday 26 August \xB7 everything is up to date",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus",
      onClick: () => nav.go('EventForm')
    }, "Create event")
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "One event needs attention",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => nav.go('Events')
    }, "Review events")
  }, "Family fossil workshop is sold out and has 6 people on the waiting list."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr 1fr' : mode === 'tablet' ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Active collections",
    value: "11",
    delta: "+1 this month",
    deltaTone: "up",
    icon: "library-big"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Upcoming events",
    value: "12",
    footnote: "3 in the next week",
    icon: "calendar-days"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Tickets booked",
    value: "1,284",
    delta: "+12% this week",
    deltaTone: "up",
    icon: "ticket"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Tickets remaining",
    value: "416",
    delta: "\u22128% this week",
    deltaTone: "down",
    icon: "ticket-x"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1.5fr 1fr' : '1fr',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Upcoming events",
    description: "Next four in the programme",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => nav.go('Events')
    }, "All events"),
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    dense: true,
    columns: [{
      key: 'name',
      header: 'Event'
    }, {
      key: 'start',
      header: 'Starts'
    }, {
      key: 'sold',
      header: 'Booked',
      align: 'right',
      render: r => `${r.sold} / ${r.capacity}`
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }],
    rows: S.events.slice(0, 4),
    style: {
      border: 0
    }
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Recent activity"
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, S.activity.map((a, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 32,
      height: 32,
      flex: '0 0 auto',
      borderRadius: '50%',
      background: 'var(--olive-50)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 15,
    color: "var(--olive-600)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-heading)'
    }
  }, a.who), " ", a.what, " ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-heading)'
    }
  }, a.target)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, a.when))))))), /*#__PURE__*/React.createElement(QuickActions, {
    mode: mode,
    nav: nav
  }));
}
Object.assign(window, {
  DashboardScreen,
  QuickActions
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/EventAdmin.jsx
try { (() => {
const {
  Button,
  DataTable,
  SearchField,
  Select,
  Field,
  Input,
  Textarea,
  ImageUpload,
  DateTimeField,
  RadioGroup,
  Modal,
  Checkbox,
  Alert,
  Icon,
  StatusBadge
} = window.HeritageMuseumDesignSystem_5a5154;
function EventsAdminScreen({
  mode,
  nav
}) {
  const [cancel, setCancel] = React.useState(null);
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Events",
    subtitle: "12 published \xB7 3 drafts \xB7 1 cancelled",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus",
      onClick: () => nav.go('EventForm')
    }, "Create event")
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(Toolbar, {
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    id: "e-q",
    size: "sm",
    placeholder: "Search events",
    style: {
      flex: '1 1 240px',
      maxWidth: 320
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "All statuses",
    options: ['Draft', 'Published', 'Cancelled', 'Completed'],
    style: {
      width: 160
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "All locations",
    options: ['Great Hall', 'Exhibition Wing', 'Lecture Theatre', 'Learning Studio'],
    style: {
      width: 180
    }
  })), /*#__PURE__*/React.createElement(DataTable, {
    sortKey: "start",
    sortDir: "asc",
    columns: [{
      key: 'name',
      header: 'Event',
      sortable: true,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("strong", {
        style: {
          font: 'var(--type-label)',
          color: 'var(--text-heading)'
        }
      }, r.name), /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, r.location))
    }, {
      key: 'start',
      header: 'Starts',
      sortable: true
    }, {
      key: 'end',
      header: 'Ends'
    }, {
      key: 'price',
      header: 'Price',
      align: 'right'
    }, {
      key: 'sold',
      header: 'Booked',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          gap: 4,
          justifyItems: 'end'
        }
      }, /*#__PURE__*/React.createElement("span", null, r.sold, " / ", r.capacity), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 70,
          height: 4,
          borderRadius: 2,
          background: 'var(--paper-200)',
          overflow: 'hidden',
          display: 'block'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          width: Math.round(r.sold / r.capacity * 100) + '%',
          height: '100%',
          background: r.sold >= r.capacity ? 'var(--danger-600)' : 'var(--olive-500)'
        }
      })))
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Status, {
        value: r.status
      })
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: "pencil",
        onClick: () => nav.go('EventForm')
      }, "Edit"), /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: "ban",
        disabled: r.status === 'Cancelled',
        onClick: () => setCancel(r)
      }, "Cancel"))
    }],
    rows: window.HMS.events
  })), /*#__PURE__*/React.createElement(Modal, {
    open: !!cancel,
    onClose: () => setCancel(null),
    title: "Cancel this event?",
    description: cancel ? cancel.name : '',
    width: 480,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setCancel(null)
    }, "Keep event"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => setCancel(null)
    }, "Cancel event"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: cancel ? `${cancel.sold} tickets have been sold` : ''
  }, "Everyone who booked is emailed and refunded automatically. The public page keeps the event visible, clearly marked as cancelled."), /*#__PURE__*/React.createElement(Field, {
    label: "Reason shown to ticket holders",
    htmlFor: "cx-r",
    required: true
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "cx-r",
    rows: 3,
    placeholder: "The artist is unwell and we have been unable to rearrange."
  })))));
}
function EventFormScreen({
  mode,
  nav
}) {
  const [status, setStatus] = React.useState('Published');
  const [capacity, setCapacity] = React.useState(200);
  const [member, setMember] = React.useState(20);
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Events'
    },
    title: "Edit event",
    subtitle: "Twilight at the Museum \xB7 162 of 200 booked",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => nav.go('Events')
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "Save draft"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "upload"
    }, "Publish changes"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1fr 320px' : '1fr',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Event details"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Event name",
    htmlFor: "ev-n",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ev-n",
    defaultValue: "Twilight at the Museum"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Description",
    htmlFor: "ev-d",
    required: true
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "ev-d",
    rows: 4,
    defaultValue: "After-hours access to the Great Hall with curator talks, live music and a late bar."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Start date",
    htmlFor: "ev-sd",
    required: true
  }, /*#__PURE__*/React.createElement(DateTimeField, {
    id: "ev-sd",
    type: "date",
    defaultValue: "2026-09-14"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "End date",
    htmlFor: "ev-ed",
    required: true
  }, /*#__PURE__*/React.createElement(DateTimeField, {
    id: "ev-ed",
    type: "date",
    defaultValue: "2026-09-14"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Start time",
    htmlFor: "ev-st",
    required: true
  }, /*#__PURE__*/React.createElement(DateTimeField, {
    id: "ev-st",
    type: "time",
    defaultValue: "18:30"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "End time",
    htmlFor: "ev-et",
    required: true
  }, /*#__PURE__*/React.createElement(DateTimeField, {
    id: "ev-et",
    type: "time",
    defaultValue: "21:00"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Location",
    htmlFor: "ev-l",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    id: "ev-l",
    options: ['Great Hall', 'Exhibition Wing', 'Lecture Theatre', 'Learning Studio', 'Gallery 9'],
    defaultValue: "Great Hall"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Associated collections",
    htmlFor: "ev-c",
    hint: "Shown on the public event page and used for recommendations."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-1)'
    }
  }, window.HMS.collections.slice(0, 4).map((c, i) => /*#__PURE__*/React.createElement(Checkbox, {
    key: c.id,
    id: 'ev-c' + c.id,
    label: c.name,
    checked: i < 2,
    onChange: () => {}
  })))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Tickets and capacity"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : 'repeat(3,1fr)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Standard price",
    htmlFor: "ev-p",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ev-p",
    defaultValue: "14.00",
    iconLeft: "pound-sterling"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Member price",
    htmlFor: "ev-mp"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ev-mp",
    defaultValue: "10.00",
    iconLeft: "pound-sterling"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Total capacity",
    htmlFor: "ev-cap",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ev-cap",
    type: "number",
    value: capacity,
    onChange: e => setCapacity(+e.target.value || 0)
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Member allocation",
    htmlFor: "ev-ma",
    hint: `${capacity - member} tickets stay on general sale. Member tickets are released to everyone 48 hours before.`
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ev-ma",
    type: "number",
    value: member,
    onChange: e => setMember(+e.target.value || 0)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: 12,
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      background: 'var(--paper-200)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: (capacity - member) / capacity * 100 + '%',
      background: 'var(--olive-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: member / capacity * 100 + '%',
      background: 'var(--sand-400)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: 'var(--olive-500)'
    }
  }), "General ", capacity - member), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: 'var(--sand-400)'
    }
  }), "Members ", member))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Publishing"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "ev-st",
    legend: "Status",
    value: status,
    onChange: setStatus,
    options: ['Draft', 'Published', 'Cancelled', 'Completed']
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Event image"
  }, /*#__PURE__*/React.createElement(ImageUpload, {
    fileName: "twilight-great-hall.jpg"
  })))));
}
function TicketsAdminScreen({
  mode,
  nav
}) {
  const [edit, setEdit] = React.useState(null);
  return /*#__PURE__*/React.createElement(StaffPage, {
    mode: mode,
    nav: nav,
    title: "Ticket management",
    subtitle: "Allocation and pricing across the programme"
  }, /*#__PURE__*/React.createElement(Panel, {
    description: "Member allocation is held until 48 hours before each event, then released to general sale."
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: 'event',
      header: 'Event',
      render: r => /*#__PURE__*/React.createElement("strong", {
        style: {
          font: 'var(--type-label)',
          color: 'var(--text-heading)'
        }
      }, r.event)
    }, {
      key: 'capacity',
      header: 'Capacity',
      align: 'right'
    }, {
      key: 'general',
      header: 'General',
      align: 'right'
    }, {
      key: 'member',
      header: 'Member',
      align: 'right'
    }, {
      key: 'booked',
      header: 'Booked',
      align: 'right'
    }, {
      key: 'left',
      header: 'Remaining',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement(StatusBadge, {
        size: "sm",
        tone: r.capacity - r.booked === 0 ? 'danger' : r.capacity - r.booked < 30 ? 'warning' : 'success'
      }, r.capacity - r.booked, " left")
    }, {
      key: 'price',
      header: 'Price'
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: "pencil",
        onClick: () => setEdit(r)
      }, "Edit")
    }],
    rows: window.HMS.tickets
  })), /*#__PURE__*/React.createElement(Modal, {
    open: !!edit,
    onClose: () => setEdit(null),
    title: "Edit ticket settings",
    description: edit ? edit.event : '',
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setEdit(null)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setEdit(null)
    }, "Save changes"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Standard price",
    htmlFor: "t-p"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "t-p",
    defaultValue: "14.00",
    iconLeft: "pound-sterling"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Member price",
    htmlFor: "t-mp"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "t-mp",
    defaultValue: "10.00",
    iconLeft: "pound-sterling"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Total capacity",
    htmlFor: "t-c"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "t-c",
    type: "number",
    defaultValue: edit ? edit.capacity : 0
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Member allocation",
    htmlFor: "t-m"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "t-m",
    type: "number",
    defaultValue: edit ? edit.member : 0
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Availability",
    htmlFor: "t-a",
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    id: "t-a",
    options: ['On sale', 'Paused', 'Closed']
  })))));
}
Object.assign(window, {
  EventsAdminScreen,
  EventFormScreen,
  TicketsAdminScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/EventAdmin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/StaffApp.jsx
try { (() => {
const {
  Icon
} = window.HeritageMuseumDesignSystem_5a5154;
const SCREENS = [{
  key: 'Dashboard',
  label: 'Dashboard',
  nav: 'Dashboard'
}, {
  key: 'Collections',
  label: 'Collection management',
  nav: 'Collections'
}, {
  key: 'CollectionForm',
  label: 'Create / edit collection',
  nav: 'Collections'
}, {
  key: 'Items',
  label: 'Item management',
  nav: 'Items'
}, {
  key: 'Categories',
  label: 'Category management',
  nav: 'Categories'
}, {
  key: 'Events',
  label: 'Event management',
  nav: 'Events'
}, {
  key: 'EventForm',
  label: 'Create / edit event',
  nav: 'Events'
}, {
  key: 'Tickets',
  label: 'Ticket management',
  nav: 'Tickets'
}, {
  key: 'Bookings',
  label: 'Booking management',
  nav: 'Bookings'
}, {
  key: 'Staff',
  label: 'Staff & roles',
  nav: 'Staff & roles'
}];
const NAV_TO_SCREEN = {
  Dashboard: 'Dashboard',
  Collections: 'Collections',
  Items: 'Items',
  Categories: 'Categories',
  Events: 'Events',
  Tickets: 'Tickets',
  Bookings: 'Bookings',
  'Staff & roles': 'Staff'
};
const WIDTHS = {
  desktop: 1440,
  tablet: 768,
  mobile: 390
};
function StaffToolbar({
  screen,
  setScreen,
  mode,
  setMode
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: 'var(--space-3) var(--space-5)',
      background: 'var(--paper-100)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Staff portal"), /*#__PURE__*/React.createElement("select", {
    value: screen,
    onChange: e => setScreen(e.target.value),
    "aria-label": "Screen",
    style: {
      minHeight: 34,
      padding: '0 10px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)'
    }
  }, SCREENS.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.key,
    value: s.key
  }, s.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 3,
      background: 'var(--paper-200)',
      borderRadius: 'var(--radius-pill)'
    }
  }, [{
    v: 'desktop',
    l: '1440',
    i: 'monitor'
  }, {
    v: 'tablet',
    l: '768',
    i: 'tablet'
  }, {
    v: 'mobile',
    l: '390',
    i: 'smartphone'
  }].map(o => /*#__PURE__*/React.createElement("button", {
    key: o.v,
    type: "button",
    onClick: () => setMode(o.v),
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      minHeight: 32,
      padding: '0 12px',
      borderRadius: 'var(--radius-pill)',
      border: 0,
      cursor: 'pointer',
      background: mode === o.v ? 'var(--surface-card)' : 'transparent',
      boxShadow: mode === o.v ? 'var(--shadow-xs)' : 'none',
      color: mode === o.v ? 'var(--text-heading)' : 'var(--text-muted)',
      font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: o.i,
    size: 14
  }), o.l))));
}
function StaffFrame({
  mode,
  children
}) {
  const w = WIDTHS[mode];
  const box = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      if (box.current) setScale(Math.min(1, (box.current.clientWidth - 32) / w));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w]);
  const h = mode === 'mobile' ? 820 : 900;
  return /*#__PURE__*/React.createElement("div", {
    ref: box,
    style: {
      padding: 'var(--space-5)',
      background: 'var(--paper-200)',
      minHeight: '100%',
      display: 'grid',
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w * scale,
      height: h * scale
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      borderRadius: mode === 'mobile' ? 24 : 8,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      background: 'var(--surface-staff)'
    }
  }, children)));
}
function StaffApp() {
  const [screen, setScreen] = React.useState('Dashboard');
  const [mode, setMode] = React.useState('desktop');
  const current = SCREENS.find(s => s.key === screen) || SCREENS[0];
  const nav = {
    active: current.nav,
    go: target => setScreen(NAV_TO_SCREEN[target] || target)
  };
  const map = {
    Dashboard: DashboardScreen,
    Collections: CollectionsAdminScreen,
    CollectionForm: CollectionFormScreen,
    Items: ItemsAdminScreen,
    Categories: CategoriesScreen,
    Events: EventsAdminScreen,
    EventForm: EventFormScreen,
    Tickets: TicketsAdminScreen,
    Bookings: BookingsScreen,
    Staff: StaffRolesScreen
  };
  const Screen = map[screen] || DashboardScreen;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--paper-200)'
    }
  }, /*#__PURE__*/React.createElement(StaffToolbar, {
    screen: screen,
    setScreen: setScreen,
    mode: mode,
    setMode: setMode
  }), /*#__PURE__*/React.createElement(StaffFrame, {
    mode: mode,
    key: mode
  }, /*#__PURE__*/React.createElement(Screen, {
    mode: mode,
    nav: nav
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(StaffApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/StaffApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/StaffShell.jsx
try { (() => {
const {
  StaffSidebar,
  StaffTopBar,
  Drawer,
  Button,
  Icon,
  StatusBadge,
  Breadcrumbs
} = window.HeritageMuseumDesignSystem_5a5154;
const STATUS_TONE = {
  Published: 'success',
  Confirmed: 'success',
  Active: 'success',
  Paid: 'success',
  Draft: 'warning',
  Pending: 'warning',
  Invited: 'warning',
  Limited: 'warning',
  Cancelled: 'danger',
  Refunded: 'danger',
  Archived: 'neutral',
  'N/A': 'neutral',
  Completed: 'info'
};
function Status({
  value
}) {
  return /*#__PURE__*/React.createElement(StatusBadge, {
    size: "sm",
    tone: STATUS_TONE[value] || 'neutral'
  }, value);
}
function StaffPage({
  mode,
  nav,
  title,
  subtitle,
  actions,
  children
}) {
  const [drawer, setDrawer] = React.useState(false);
  const desktop = mode === 'desktop';
  const tablet = mode === 'tablet';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      height: '100%',
      minHeight: 760,
      background: 'var(--surface-staff)'
    }
  }, mode !== 'mobile' && /*#__PURE__*/React.createElement(StaffSidebar, {
    active: nav.active,
    collapsed: tablet,
    onNavigate: nav.go
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(StaffTopBar, {
    title: title,
    subtitle: subtitle,
    actions: actions,
    showMenu: mode === 'mobile',
    showSearch: desktop,
    onMenu: () => setDrawer(true)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: mode === 'mobile' ? 'var(--space-5)' : 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      maxWidth: 1240,
      margin: '0 auto'
    }
  }, children))), /*#__PURE__*/React.createElement(Drawer, {
    open: drawer,
    side: "left",
    title: "Staff portal",
    onClose: () => setDrawer(false),
    size: 280,
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'calc(var(--space-5) * -1)'
    }
  }, /*#__PURE__*/React.createElement(StaffSidebar, {
    active: nav.active,
    onNavigate: l => {
      nav.go(l);
      setDrawer(false);
    },
    style: {
      width: '100%'
    }
  }))));
}
function Panel({
  title,
  description,
  actions,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)',
      ...style
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      padding: 'var(--space-5) var(--space-5) var(--space-4)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) var(--text-lg)/1.2 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, description)), actions), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, children));
}
function Toolbar({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center',
      flexWrap: 'wrap',
      ...style
    }
  }, children);
}
function RowActions({
  onEdit,
  onArchive,
  destructive = 'Archive'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-1)',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: "pencil",
    onClick: onEdit
  }, "Edit"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: "archive",
    onClick: onArchive
  }, destructive));
}
Object.assign(window, {
  StaffPage,
  Panel,
  Toolbar,
  RowActions,
  Status,
  STATUS_TONE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/StaffShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff_portal/data.js
try { (() => {
window.HMS = {
  collections: [{
    id: 1,
    name: 'Ice Age Britain',
    category: 'Prehistory',
    location: 'Gallery 1',
    status: 'Published',
    items: 128,
    updated: '2 days ago'
  }, {
    id: 2,
    name: 'The Lanthorn Hoard',
    category: 'Archaeology',
    location: 'Gallery 4',
    status: 'Published',
    items: 92,
    updated: '4 days ago'
  }, {
    id: 3,
    name: 'Renaissance Portraits',
    category: 'Renaissance',
    location: 'Gallery 9',
    status: 'Draft',
    items: 64,
    updated: '6 days ago'
  }, {
    id: 4,
    name: 'Medieval Armoury',
    category: 'Medieval',
    location: 'Gallery 7',
    status: 'Published',
    items: 41,
    updated: '2 weeks ago'
  }, {
    id: 5,
    name: 'Victorian Toys',
    category: 'Art',
    location: 'Store',
    status: 'Archived',
    items: 18,
    updated: '3 months ago'
  }],
  items: [{
    id: 1,
    name: 'Bronze ceremonial helmet',
    collection: 'The Lanthorn Hoard',
    period: 'Iron Age',
    date: 'c. 300 BCE',
    status: 'Published',
    location: 'Case 4A'
  }, {
    id: 2,
    name: 'Gold neck torc',
    collection: 'The Lanthorn Hoard',
    period: 'Iron Age',
    date: 'c. 280 BCE',
    status: 'Published',
    location: 'Case 4A'
  }, {
    id: 3,
    name: 'Ritual bowl with boar frieze',
    collection: 'The Lanthorn Hoard',
    period: 'Iron Age',
    date: 'c. 300 BCE',
    status: 'Draft',
    location: 'Conservation'
  }, {
    id: 4,
    name: 'Iron sword with wooden grip',
    collection: 'The Lanthorn Hoard',
    period: 'Iron Age',
    date: 'c. 320 BCE',
    status: 'Published',
    location: 'Case 4D'
  }, {
    id: 5,
    name: 'Enamelled disc brooch',
    collection: 'The Lanthorn Hoard',
    period: 'Iron Age',
    date: 'c. 250 BCE',
    status: 'Archived',
    location: 'Store 2'
  }],
  categories: [{
    id: 1,
    name: 'Prehistory',
    collections: 3,
    items: 214,
    status: 'Active'
  }, {
    id: 2,
    name: 'Dinosaurs',
    collections: 2,
    items: 96,
    status: 'Active'
  }, {
    id: 3,
    name: 'Archaeology',
    collections: 4,
    items: 572,
    status: 'Active'
  }, {
    id: 4,
    name: 'Ancient History',
    collections: 2,
    items: 210,
    status: 'Active'
  }, {
    id: 5,
    name: 'Medieval',
    collections: 1,
    items: 41,
    status: 'Active'
  }, {
    id: 6,
    name: 'Renaissance',
    collections: 1,
    items: 64,
    status: 'Active'
  }, {
    id: 7,
    name: 'Art',
    collections: 2,
    items: 55,
    status: 'Active'
  }, {
    id: 8,
    name: 'Industry',
    collections: 0,
    items: 0,
    status: 'Archived'
  }],
  events: [{
    id: 1,
    name: 'Beneath the Lanthorn Fields',
    status: 'Published',
    start: '3 Jul 2026',
    end: '3 Jan 2027',
    location: 'Exhibition Wing',
    price: '£16',
    capacity: 1200,
    sold: 560
  }, {
    id: 2,
    name: 'Twilight at the Museum',
    status: 'Published',
    start: '14 Sep 2026',
    end: '14 Sep 2026',
    location: 'Great Hall',
    price: '£14',
    capacity: 200,
    sold: 162
  }, {
    id: 3,
    name: 'Curator talk: Reading the Lanthorn Hoard',
    status: 'Published',
    start: '21 Sep 2026',
    end: '21 Sep 2026',
    location: 'Lecture Theatre',
    price: 'Free',
    capacity: 120,
    sold: 38
  }, {
    id: 4,
    name: 'Family fossil workshop',
    status: 'Published',
    start: '27 Sep 2026',
    end: '27 Sep 2026',
    location: 'Learning Studio',
    price: '£8',
    capacity: 40,
    sold: 40
  }, {
    id: 5,
    name: 'Late-night life drawing',
    status: 'Cancelled',
    start: '2 Oct 2026',
    end: '2 Oct 2026',
    location: 'Gallery 9',
    price: '£18',
    capacity: 30,
    sold: 0
  }, {
    id: 6,
    name: 'Winter conservation open day',
    status: 'Draft',
    start: '14 Nov 2026',
    end: '14 Nov 2026',
    location: 'Conservation Studio',
    price: 'Free',
    capacity: 60,
    sold: 0
  }],
  tickets: [{
    id: 1,
    event: 'Twilight at the Museum',
    capacity: 200,
    general: 180,
    member: 20,
    booked: 162,
    price: '£14 · £10 member'
  }, {
    id: 2,
    event: 'Beneath the Lanthorn Fields',
    capacity: 1200,
    general: 1050,
    member: 150,
    booked: 560,
    price: '£16 · £12 member'
  }, {
    id: 3,
    event: 'Curator talk: Reading the Lanthorn Hoard',
    capacity: 120,
    general: 100,
    member: 20,
    booked: 38,
    price: 'Free'
  }, {
    id: 4,
    event: 'Family fossil workshop',
    capacity: 40,
    general: 32,
    member: 8,
    booked: 40,
    price: '£8 · £5 member'
  }],
  bookings: [{
    id: 'HM-2026-04821',
    customer: 'Amara Okafor',
    event: 'Beneath the Lanthorn Fields',
    qty: 2,
    date: '12 Aug 2026',
    total: '£33.60',
    payment: 'Paid',
    status: 'Confirmed'
  }, {
    id: 'HM-2026-04820',
    customer: 'Tom Brady-Hall',
    event: 'Twilight at the Museum',
    qty: 4,
    date: '12 Aug 2026',
    total: '£58.10',
    payment: 'Paid',
    status: 'Confirmed'
  }, {
    id: 'HM-2026-04819',
    customer: 'Priya Raman',
    event: 'Curator talk: Reading the Lanthorn Hoard',
    qty: 1,
    date: '11 Aug 2026',
    total: 'Free',
    payment: 'N/A',
    status: 'Confirmed'
  }, {
    id: 'HM-2026-04818',
    customer: 'Jonah Weiss',
    event: 'Family fossil workshop',
    qty: 3,
    date: '11 Aug 2026',
    total: '£24.00',
    payment: 'Pending',
    status: 'Pending'
  }, {
    id: 'HM-2026-04817',
    customer: 'Elena Rossi',
    event: 'Twilight at the Museum',
    qty: 2,
    date: '10 Aug 2026',
    total: '£29.05',
    payment: 'Refunded',
    status: 'Cancelled'
  }],
  staff: [{
    id: 1,
    name: 'Raza Syed',
    email: 'r.syed@heritagemuseum.org',
    role: 'Administrator',
    status: 'Active',
    last: 'Today, 09:12'
  }, {
    id: 2,
    name: 'Naomi Vale',
    email: 'n.vale@heritagemuseum.org',
    role: 'Collection Manager',
    status: 'Active',
    last: 'Today, 08:40'
  }, {
    id: 3,
    name: 'Dan Oyelaran',
    email: 'd.oyelaran@heritagemuseum.org',
    role: 'Event Manager',
    status: 'Active',
    last: 'Yesterday, 17:03'
  }, {
    id: 4,
    name: 'Sara Whitlock',
    email: 's.whitlock@heritagemuseum.org',
    role: 'Front of House',
    status: 'Invited',
    last: '—'
  }],
  roles: [{
    name: 'Administrator',
    people: 1,
    permissions: ['collection.*', 'event.*', 'ticket.manage', 'booking.manage', 'staff.manage', 'category.manage']
  }, {
    name: 'Collection Manager',
    people: 1,
    permissions: ['collection.create', 'collection.edit', 'item.manage', 'category.manage']
  }, {
    name: 'Event Manager',
    people: 1,
    permissions: ['event.create', 'event.edit', 'event.cancel', 'ticket.manage']
  }, {
    name: 'Front of House',
    people: 1,
    permissions: ['booking.view', 'booking.checkin']
  }],
  activity: [{
    who: 'Naomi Vale',
    what: 'published the collection',
    target: 'The Lanthorn Hoard',
    when: '12 minutes ago',
    icon: 'library-big'
  }, {
    who: 'Dan Oyelaran',
    what: 'cancelled the event',
    target: 'Late-night life drawing',
    when: '1 hour ago',
    icon: 'calendar-x'
  }, {
    who: 'Raza Syed',
    what: 'changed the member allocation for',
    target: 'Twilight at the Museum',
    when: '3 hours ago',
    icon: 'ticket'
  }, {
    who: 'Naomi Vale',
    what: 'added 12 items to',
    target: 'Ice Age Britain',
    when: 'Yesterday',
    icon: 'gem'
  }, {
    who: 'Sara Whitlock',
    what: 'was invited as',
    target: 'Front of House',
    when: 'Yesterday',
    icon: 'user-plus'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff_portal/data.js", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/AccountScreens.jsx
try { (() => {
const {
  Button,
  Field,
  Input,
  Checkbox,
  Alert,
  Icon,
  StatusBadge,
  Logo,
  Tabs,
  DataTable,
  RecommendationCard,
  EmptyState,
  Card
} = window.HeritageMuseumDesignSystem_5a5154;
function AuthLayout({
  mode,
  title,
  intro,
  children,
  footer
}) {
  const narrow = mode !== 'desktop';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
      minHeight: '100%',
      background: 'var(--surface-page)'
    }
  }, !narrow && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--green-900)',
      display: 'grid',
      alignContent: 'end',
      padding: 'var(--space-16)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(160deg,#2A5033 0%,#14231A 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.png",
    alt: "",
    style: {
      height: 72,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-regular) var(--text-4xl)/1.1 var(--font-display)',
      color: 'var(--paper-50)',
      maxWidth: 420
    }
  }, "Heritage lives here."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'rgba(245,243,233,.78)',
      maxWidth: 400
    }
  }, "An account keeps your tickets in one place and shapes what we suggest you see next. Membership is separate \u2014 and optional."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: narrow ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 420,
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "horizontal",
    height: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      fontSize: 36
    }
  }, title), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)'
    }
  }, intro)), children, footer)));
}
function SignInScreen({
  mode,
  nav
}) {
  const [err, setErr] = React.useState(false);
  return /*#__PURE__*/React.createElement(AuthLayout, {
    mode: mode,
    title: "Sign in",
    intro: "Your tickets, saved objects and recommendations.",
    footer: /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }
    }, "New here? ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        nav.go('Register');
      }
    }, "Create an account"))
  }, err && /*#__PURE__*/React.createElement(Alert, {
    tone: "danger",
    title: "We couldn't sign you in"
  }, "Check your email and password, or reset it below."), /*#__PURE__*/React.createElement("form", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    },
    onSubmit: e => {
      e.preventDefault();
      nav.signIn();
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "si-e",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "si-e",
    type: "email",
    defaultValue: "amara@example.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    htmlFor: "si-p",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "si-p",
    type: "password",
    defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    invalid: err
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    id: "si-r",
    label: "Remember me",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: 'var(--type-body-sm)'
    }
  }, "Forgot your password?")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    fullWidth: true
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "ghost",
    size: "sm",
    onClick: () => setErr(!err)
  }, "Preview the error state")));
}
function RegisterScreen({
  mode,
  nav
}) {
  return /*#__PURE__*/React.createElement(AuthLayout, {
    mode: mode,
    title: "Create an account",
    intro: "It takes a minute and keeps every booking in one place.",
    footer: /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }
    }, "Already have one? ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        nav.go('SignIn');
      }
    }, "Sign in"))
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "An account is not a membership"
  }, "Accounts are free. Membership is a paid supporter scheme with discounts and reserved tickets \u2014 you can add it later."), /*#__PURE__*/React.createElement("form", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    },
    onSubmit: e => {
      e.preventDefault();
      nav.go('Interests');
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    htmlFor: "r-n",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "r-n",
    placeholder: "Amara Okafor"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "r-e",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "r-e",
    type: "email",
    placeholder: "you@example.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    htmlFor: "r-p",
    required: true,
    hint: "At least 10 characters."
  }, /*#__PURE__*/React.createElement(Input, {
    id: "r-p",
    type: "password"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Confirm password",
    htmlFor: "r-p2",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "r-p2",
    type: "password"
  })), /*#__PURE__*/React.createElement(Checkbox, {
    id: "r-nl",
    label: "Email me what's on",
    description: "Monthly exhibition news. Unsubscribe any time.",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    fullWidth: true
  }, "Create account")));
}
function InterestsScreen({
  mode,
  nav
}) {
  const [picked, setPicked] = React.useState(['Prehistory', 'Archaeology']);
  const toggle = i => setPicked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const ICONS = {
    Dinosaurs: 'bone',
    Prehistory: 'mountain',
    'Ancient History': 'landmark',
    Archaeology: 'shovel',
    Medieval: 'castle',
    Renaissance: 'palette',
    Art: 'frame',
    'Natural History': 'leaf'
  };
  return /*#__PURE__*/React.createElement(AuthLayout, {
    mode: mode,
    title: "What are you interested in?",
    intro: "Pick a few and we'll start you off with collections and events that match. You can change these any time."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-3)'
    }
  }, window.HM.interests.map(i => {
    const on = picked.includes(i);
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => toggle(i),
      "aria-pressed": on,
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
        minHeight: 56,
        padding: '0 var(--space-4)',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        textAlign: 'left',
        border: '1px solid ' + (on ? 'var(--olive-500)' : 'var(--border-default)'),
        background: on ? 'var(--olive-50)' : 'var(--surface-card)',
        color: on ? 'var(--olive-700)' : 'var(--text-heading)',
        font: 'var(--weight-' + (on ? 'semibold' : 'regular') + ') var(--text-sm)/1.2 var(--font-body)',
        boxShadow: on ? 'var(--ring-focus)' : 'none',
        transition: 'var(--transition-control)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ICONS[i],
      size: 18,
      color: on ? 'var(--olive-600)' : 'var(--text-muted)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, i), on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    disabled: !picked.length,
    onClick: () => nav.signIn()
  }, "Save ", picked.length, " interests"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    fullWidth: true,
    onClick: () => nav.signIn()
  }, "Skip for now")));
}
function ProfileScreen({
  mode,
  nav
}) {
  const [tab, setTab] = React.useState('bookings');
  const user = nav.user || {
    name: 'Amara Okafor',
    initials: 'AO'
  };
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Profile'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'var(--green-900)',
      color: 'var(--sand-300)',
      font: '400 28px/1 var(--font-display)'
    }
  }, user.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      fontSize: 36
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, nav.isMember ? /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "member"
  }, "Member \xB7 renews 4 Mar 2027") : /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "neutral",
    icon: "user"
  }, "Registered visitor"), /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "neutral",
    icon: "mail"
  }, "amara@example.com"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, !nav.isMember && /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    onClick: () => nav.go('Membership')
  }, "Become a member"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => nav.signOut()
  }, "Sign out"))), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    style: {
      marginTop: 'var(--space-8)'
    },
    items: [{
      value: 'bookings',
      label: 'Bookings',
      count: 3
    }, {
      value: 'saved',
      label: 'Saved',
      count: 0
    }, {
      value: 'interests',
      label: 'Interests'
    }, {
      value: 'settings',
      label: 'Settings'
    }]
  }))), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)'
    }
  }, tab === 'bookings' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    caption: "Your bookings",
    columns: [{
      key: 'ref',
      header: 'Reference'
    }, {
      key: 'event',
      header: 'Event'
    }, {
      key: 'date',
      header: 'Date'
    }, {
      key: 'qty',
      header: 'Tickets',
      align: 'right'
    }, {
      key: 'total',
      header: 'Total',
      align: 'right'
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(StatusBadge, {
        size: "sm",
        tone: r.status === 'Confirmed' ? 'success' : 'danger'
      }, r.status)
    }, {
      key: 'a',
      header: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: "qr-code"
      }, "Ticket")
    }],
    rows: window.HM.bookings
  })), tab === 'saved' && /*#__PURE__*/React.createElement(EmptyState, {
    icon: "bookmark",
    title: "Nothing saved yet",
    description: "Save an object or an exhibition and it will wait for you here.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => nav.go('Collections')
    }, "Browse collections")
  }), tab === 'interests' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h2)'
    }
  }, "Your interests"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, ['Prehistory', 'Archaeology', 'Medieval'].map(i => /*#__PURE__*/React.createElement(StatusBadge, {
    key: i,
    tone: "olive"
  }, i)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: "pencil",
    onClick: () => nav.go('Interests')
  }, "Edit"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h2)'
    }
  }, "Because of what you've explored"), /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 2,
    tablet: 2,
    mobile: 1
  }, /*#__PURE__*/React.createElement(RecommendationCard, {
    kind: "Collection",
    title: "Ice Age Britain",
    reason: "Because you explored Prehistory"
  }), /*#__PURE__*/React.createElement(RecommendationCard, {
    kind: "Event",
    title: "Curator talk: Reading the Lanthorn Hoard",
    reason: "Archaeology, this month",
    tone: "stone"
  })))), tab === 'settings' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    htmlFor: "s-n"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "s-n",
    defaultValue: user.name
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "s-e"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "s-e",
    defaultValue: "amara@example.com"
  })), /*#__PURE__*/React.createElement(Checkbox, {
    id: "s-nl",
    checked: true,
    onChange: () => {},
    label: "Email me what's on",
    description: "Monthly exhibition news."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    id: "s-rec",
    checked: true,
    onChange: () => {},
    label: "Use my activity for recommendations",
    description: "Turn this off and we'll show popular content instead."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Save changes"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Cancel")))));
}
function MembershipScreen({
  mode,
  nav
}) {
  const benefits = [{
    icon: 'percent',
    title: 'Reduced ticket prices',
    body: 'Roughly a third off every ticketed event, applied automatically at checkout.'
  }, {
    icon: 'bookmark-check',
    title: 'Reserved allocation',
    body: 'A block of tickets is held for members on every event until 48 hours before.'
  }, {
    icon: 'clock-4',
    title: 'Early access',
    body: 'Book new exhibitions a week before general release.'
  }, {
    icon: 'users',
    title: 'Bring a guest',
    body: 'One guest at the member price on every visit.'
  }, {
    icon: 'coffee',
    title: 'Ten percent off the café and shop',
    body: 'Including the second-hand book room.'
  }, {
    icon: 'mail',
    title: 'Members\u2019 letter',
    body: 'A quarterly letter from the curators, printed and posted.'
  }];
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Membership'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-accent)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-10) var(--container-pad-mobile)' : 'var(--space-16) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      maxWidth: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--gold-700)'
    }
  }, "Membership"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-4xl)/1.05 var(--font-display)' : 'var(--weight-regular) var(--text-5xl)/1.05 var(--font-display)'
    }
  }, "Support the museum, see more of it"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      fontSize: 18
    }
  }, "Membership keeps the galleries free to enter and the conservation studio working. It also makes your own visits cheaper."), nav.isMember ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "member"
  }, "Active member since March 2024"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "settings"
  }, "Manage membership")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => nav.setMember(true)
  }, "Become a member"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    onClick: () => nav.go('Tickets')
  }, "Just book a ticket"))))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    title: "What membership includes"
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 3,
    tablet: 2,
    mobile: 1
  }, benefits.map(b => /*#__PURE__*/React.createElement(Card, {
    key: b.title,
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-md)',
      background: 'var(--olive-50)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.icon,
    size: 20,
    color: "var(--olive-600)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)',
      fontSize: 20
    }
  }, b.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, b.body))))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    tone: "muted",
    title: "Choose a membership"
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 3,
    tablet: 3,
    mobile: 1
  }, [['Individual', '£00', 'One named member'], ['Joint', '£00', 'Two named members at one address'], ['Family', '£00', 'Two adults and up to four children']].map(([n, p, d], i) => /*#__PURE__*/React.createElement(Card, {
    key: n,
    interactive: true,
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      border: i === 1 ? '2px solid var(--olive-500)' : undefined
    }
  }, i === 1 && /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "olive",
    size: "sm",
    icon: "star"
  }, "Most chosen"), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-3xl)/1 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, p, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, " / year")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, d), /*#__PURE__*/React.createElement(Button, {
    variant: i === 1 ? 'primary' : 'secondary',
    fullWidth: true,
    disabled: nav.isMember,
    onClick: () => nav.setMember(true)
  }, nav.isMember ? 'You are a member' : 'Choose ' + n)))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "Prices are placeholders pending the museum's 2027 rates.")));
}
Object.assign(window, {
  SignInScreen,
  RegisterScreen,
  InterestsScreen,
  ProfileScreen,
  MembershipScreen,
  AuthLayout
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/AccountScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/CollectionScreens.jsx
try { (() => {
const {
  Button,
  IconButton,
  CollectionCard,
  ItemCard,
  RecommendationCard,
  EventCard,
  FilterPanel,
  SearchField,
  Select,
  Pagination,
  Breadcrumbs,
  Drawer,
  Media,
  StatusBadge,
  Icon,
  EmptyState
} = window.HeritageMuseumDesignSystem_5a5154;
function useFilters() {
  const [selected, setSelected] = React.useState({
    Category: ['Prehistory']
  });
  const toggle = (g, v) => setSelected(s => {
    const cur = s[g] || [];
    return {
      ...s,
      [g]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
    };
  });
  const count = Object.values(selected).reduce((n, a) => n + a.length, 0);
  return {
    selected,
    toggle,
    count,
    clear: () => setSelected({})
  };
}
function CollectionsScreen({
  mode,
  nav
}) {
  const {
    collections,
    categories,
    periods
  } = window.HM;
  const fx = useFilters();
  const [q, setQ] = React.useState('');
  const [drawer, setDrawer] = React.useState(false);
  const groups = [{
    title: 'Category',
    options: categories.map(c => ({
      value: c,
      label: c,
      count: 4 + c.length
    }))
  }, {
    title: 'Period',
    options: periods.map(p => ({
      value: p,
      label: p
    }))
  }];
  const results = collections.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  const filters = /*#__PURE__*/React.createElement(FilterPanel, {
    groups: groups,
    selected: fx.selected,
    onToggle: fx.toggle,
    activeCount: fx.count,
    onClear: fx.clear,
    sortOptions: ['Most popular', 'Recently added', 'A–Z', 'Oldest first'],
    sort: "Most popular"
  });
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Collections'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-6) var(--container-pad-mobile)' : 'var(--space-10) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: ['Home', 'Collections'],
    style: {
      marginBottom: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)',
      marginBottom: 'var(--space-3)'
    }
  }, "Collections"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      maxWidth: 560,
      marginBottom: 'var(--space-6)'
    }
  }, "Eleven permanent collections, from the Pleistocene to the nineteenth century. Filter by category or period to narrow things down."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    id: "col-search",
    value: q,
    onChange: e => setQ(e.target.value),
    onClear: () => setQ(''),
    placeholder: "Search collections",
    style: {
      flex: '1 1 280px',
      maxWidth: 420
    }
  }), mode !== 'desktop' && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "sliders-horizontal",
    onClick: () => setDrawer(true)
  }, "Filters", fx.count ? ` (${fx.count})` : ''), mode === 'desktop' && /*#__PURE__*/React.createElement(Select, {
    options: ['Most popular', 'Recently added', 'A–Z'],
    style: {
      width: 200
    }
  })))), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '248px 1fr' : '1fr',
      gap: 'var(--space-10)',
      alignItems: 'start'
    }
  }, mode === 'desktop' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 100
    }
  }, filters), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "Showing ", results.length, " of 11 collections"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, (fx.selected.Category || []).map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    type: "button",
    onClick: () => fx.toggle('Category', c),
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center',
      minHeight: 32,
      padding: '0 10px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--olive-300)',
      background: 'var(--olive-50)',
      color: 'var(--olive-700)',
      cursor: 'pointer',
      font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)'
    }
  }, c, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  }))))), results.length ? /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 3,
    tablet: 2,
    mobile: 1
  }, results.map(c => /*#__PURE__*/React.createElement(CollectionCard, {
    key: c.id,
    name: c.name,
    category: c.category,
    period: c.period,
    description: c.description,
    itemCount: c.items,
    tone: c.tone,
    onClick: () => nav.go('Collection')
  }))) : /*#__PURE__*/React.createElement(EmptyState, {
    title: "No collections match your search",
    description: "Try a different word, or clear your filters.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => {
        setQ('');
        fx.clear();
      }
    }, "Clear everything")
  }), mode === 'desktop' ? /*#__PURE__*/React.createElement(Pagination, {
    page: 1,
    pages: 4,
    style: {
      justifyContent: 'center'
    }
  }) : /*#__PURE__*/React.createElement(Pagination, {
    showLoadMore: true,
    resultLabel: `Showing ${results.length} of 11 collections`
  })))), /*#__PURE__*/React.createElement(Drawer, {
    open: drawer,
    side: "bottom",
    title: "Filter collections",
    onClose: () => setDrawer(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      fullWidth: true,
      onClick: fx.clear
    }, "Clear all"), /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      onClick: () => setDrawer(false)
    }, "Show ", results.length, " results"))
  }, filters));
}
function DetailHero({
  mode,
  title,
  eyebrow,
  meta,
  description,
  actions,
  crumbs
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--green-900)'
    }
  }, /*#__PURE__*/React.createElement(Media, {
    tone: "green",
    radius: "0",
    caption: "Collection photography",
    style: {
      position: 'absolute',
      inset: 0,
      height: '100%',
      aspectRatio: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-hero)'
    }
  }), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      position: 'relative',
      padding: mode === 'mobile' ? 'var(--space-6) var(--container-pad-mobile) var(--space-10)' : 'var(--space-8) var(--container-pad-desktop) var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-6)',
      filter: 'invert(1) grayscale(1) brightness(2)'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: crumbs
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      maxWidth: 620
    }
  }, eyebrow, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--weight-regular) var(--text-5xl)/1.05 var(--font-display)',
      color: 'var(--paper-50)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'rgba(245,243,233,.86)'
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      flexWrap: 'wrap',
      font: 'var(--type-body-sm)',
      color: 'var(--sand-300)'
    }
  }, meta), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-2)'
    }
  }, actions))));
}
function MetaItem({
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  }), children);
}
function CollectionDetailScreen({
  mode,
  nav
}) {
  const c = window.HM.collections[2];
  const items = window.HM.items;
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Collections'
    }
  }, /*#__PURE__*/React.createElement(DetailHero, {
    mode: mode,
    crumbs: ['Home', 'Collections', c.name],
    title: c.name,
    eyebrow: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "olive",
      size: "sm"
    }, c.category), /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "neutral",
      size: "sm",
      icon: "hourglass"
    }, c.period)),
    description: "Ninety-two objects buried together in the third century BCE and found by a farmer in 1974. Together they form the most complete Iron Age deposit in the region.",
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MetaItem, {
      icon: "map-pin"
    }, c.location), /*#__PURE__*/React.createElement(MetaItem, {
      icon: "gem"
    }, c.items, " objects"), /*#__PURE__*/React.createElement(MetaItem, {
      icon: "clock-4"
    }, "Allow 45 minutes")),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      onClick: () => nav.go('Item')
    }, "Start with the highlights"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      style: {
        color: 'var(--paper-50)',
        borderColor: 'rgba(242,226,166,.5)'
      },
      onClick: () => nav.go('Tickets')
    }, "Plan your visit"))
  }), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    title: "Objects in this collection",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconRight: "arrow-right"
    }, "All ", c.items, " objects")
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 4,
    tablet: 3,
    mobile: 2
  }, items.map(i => /*#__PURE__*/React.createElement(ItemCard, {
    key: i.id,
    name: i.name,
    period: i.period,
    date: i.date,
    description: i.description,
    onClick: () => nav.go('Item')
  })))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    tone: "muted",
    title: "Events about this collection"
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 2,
    tablet: 1,
    mobile: 1
  }, window.HM.events.slice(1, 3).map(e => /*#__PURE__*/React.createElement(EventCard, {
    key: e.id,
    layout: mode === 'desktop' ? 'horizontal' : 'vertical',
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    location: e.location,
    price: e.price,
    free: e.free,
    availability: e.availability,
    onBook: () => nav.go('Tickets')
  })))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    title: "Related collections"
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 3,
    tablet: 2,
    mobile: 1
  }, window.HM.collections.slice(3, 6).map(x => /*#__PURE__*/React.createElement(CollectionCard, {
    key: x.id,
    name: x.name,
    category: x.category,
    period: x.period,
    description: x.description,
    itemCount: x.items,
    tone: x.tone
  })))));
}
function ItemDetailScreen({
  mode,
  nav
}) {
  const it = window.HM.items[0];
  const [shot, setShot] = React.useState(0);
  const facts = [['Historical period', it.period], ['Approximate date', it.date], ['Origin', it.origin], ['Category', 'Archaeology'], ['Collection', it.collection], ['On display', it.location], ['Materials', 'Cast bronze with iron rivets'], ['Accession number', 'HM.1974.0041']];
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Collections'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-5) var(--container-pad-mobile) var(--space-10)' : 'var(--space-8) var(--container-pad-desktop) var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: ['Home', 'Collections', it.collection, it.name],
    style: {
      marginBottom: 'var(--space-6)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1.1fr 1fr' : '1fr',
      gap: 'var(--space-10)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Media, {
    ratio: "4 / 3",
    tone: ['stone', 'olive', 'green', 'sand'][shot],
    caption: `${it.name} — view ${shot + 1}`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    onClick: () => setShot(i),
    "aria-label": `View ${i + 1}`,
    style: {
      flex: 1,
      padding: 0,
      border: '2px solid ' + (i === shot ? 'var(--olive-500)' : 'transparent'),
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      cursor: 'pointer',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Media, {
    ratio: "1 / 1",
    tone: ['stone', 'olive', 'green', 'sand'][i],
    caption: "",
    radius: "var(--radius-sm)"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "olive",
    size: "sm"
  }, "Archaeology"), /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "neutral",
    size: "sm",
    icon: "hourglass"
  }, it.period), /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "success",
    size: "sm",
    icon: "eye"
  }, "On display")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)'
    }
  }, it.name), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)'
    }
  }, "Cast in a single piece and never worn in battle, this helmet was placed at the centre of the hoard, upturned and filled with river silt. The crest was hammered separately and riveted on \u2014 the join is still visible under raking light."), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 'var(--space-3) var(--space-6)',
      margin: 0,
      padding: 'var(--space-5) 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, facts.map(([k, v]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: k
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      font: 'var(--weight-semibold) var(--text-xs)/1.4 var(--font-body)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    iconLeft: "map",
    onClick: () => nav.go('Collection')
  }, "Find it in the gallery"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "bookmark"
  }, "Save to your list"))))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    tone: "muted",
    title: "Related objects"
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 4,
    tablet: 3,
    mobile: 2
  }, window.HM.items.slice(1, 5).map(i => /*#__PURE__*/React.createElement(ItemCard, {
    key: i.id,
    name: i.name,
    period: i.period,
    date: i.date,
    description: i.description
  })))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    title: "You may also like"
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 2,
    tablet: 2,
    mobile: 1
  }, /*#__PURE__*/React.createElement(RecommendationCard, {
    kind: "Collection",
    title: "Coin & Currency",
    reason: "Often viewed with The Lanthorn Hoard",
    tone: "sand"
  }), /*#__PURE__*/React.createElement(RecommendationCard, {
    kind: "Event",
    title: "Curator talk: Reading the Lanthorn Hoard",
    reason: "Archaeology, this month",
    tone: "stone"
  }))));
}
Object.assign(window, {
  CollectionsScreen,
  CollectionDetailScreen,
  ItemDetailScreen,
  DetailHero,
  MetaItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/CollectionScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/EventScreens.jsx
try { (() => {
const {
  Button,
  EventCard,
  Tabs,
  FilterPanel,
  SearchField,
  Drawer,
  Breadcrumbs,
  StatusBadge,
  Icon,
  Media,
  Alert,
  CollectionCard,
  Pagination
} = window.HeritageMuseumDesignSystem_5a5154;
function EventsScreen({
  mode,
  nav
}) {
  const [tab, setTab] = React.useState('now');
  const [drawer, setDrawer] = React.useState(false);
  const events = window.HM.events;
  const groups = [{
    title: 'When',
    options: ['This week', 'This month', 'Next three months']
  }, {
    title: 'Type',
    options: ['Exhibition', 'Talk', 'Workshop', 'Family', 'Late opening']
  }, {
    title: 'Price',
    options: ['Free', 'Paid', 'Member price']
  }, {
    title: 'Availability',
    options: ['Tickets available', 'Limited', 'Include sold out']
  }];
  const filters = /*#__PURE__*/React.createElement(FilterPanel, {
    groups: groups,
    selected: {
      Price: ['Free']
    },
    activeCount: 1,
    onClear: () => {},
    sortOptions: ['Soonest first', 'Recently added', 'Price: low to high'],
    sort: "Soonest first"
  });
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Events'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-6) var(--container-pad-mobile)' : 'var(--space-10) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: ['Home', "What's on"],
    style: {
      marginBottom: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)',
      marginBottom: 'var(--space-3)'
    }
  }, "What's on"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      maxWidth: 560,
      marginBottom: 'var(--space-6)'
    }
  }, "Exhibitions, talks, workshops and late openings. Members book from a reserved allocation."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    value: tab,
    onChange: setTab,
    items: [{
      value: 'now',
      label: 'On now',
      count: 4
    }, {
      value: 'soon',
      label: 'Upcoming',
      count: 12
    }, {
      value: 'exh',
      label: 'Exhibitions',
      count: 3
    }, {
      value: 'free',
      label: 'Free',
      count: 6
    }]
  }), mode !== 'desktop' && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "sliders-horizontal",
    onClick: () => setDrawer(true)
  }, "Filters (1)")))), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '248px 1fr' : '1fr',
      gap: 'var(--space-10)',
      alignItems: 'start'
    }
  }, mode === 'desktop' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 100
    }
  }, filters), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, events.length, " events"), nav.isMember && /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "member"
  }, "Member allocation available on 3 events")), events.map(e => /*#__PURE__*/React.createElement(EventCard, {
    key: e.id,
    layout: mode === 'mobile' ? 'vertical' : 'horizontal',
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    location: e.location,
    price: e.price,
    free: e.free,
    availability: e.availability,
    onBook: () => nav.go('Event')
  })), /*#__PURE__*/React.createElement(Pagination, {
    showLoadMore: true,
    resultLabel: "Showing 5 of 19 events",
    style: {
      marginTop: 'var(--space-4)'
    }
  })))), /*#__PURE__*/React.createElement(Drawer, {
    open: drawer,
    side: "bottom",
    title: "Filter events",
    onClose: () => setDrawer(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      fullWidth: true
    }, "Clear all"), /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      onClick: () => setDrawer(false)
    }, "Show 5 events"))
  }, filters));
}
function EventDetailScreen({
  mode,
  nav
}) {
  const [which, setWhich] = React.useState('twilight');
  const e = window.HM.events.find(x => x.id === which) || window.HM.events[0];
  const cancelled = e.availability === 'cancelled';
  const soldout = e.availability === 'soldout';
  const badge = {
    available: ['success', 'Tickets available'],
    limited: ['warning', `Limited — ${e.remaining} left`],
    soldout: ['danger', 'Sold out'],
    cancelled: ['danger', 'Cancelled']
  }[e.availability];
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Events'
    }
  }, /*#__PURE__*/React.createElement(DetailHero, {
    mode: mode,
    crumbs: ['Home', "What's on", e.title],
    title: e.title,
    eyebrow: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      tone: badge[0],
      size: "sm"
    }, badge[1]), e.free && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "info",
      size: "sm",
      icon: "gift"
    }, "Free"), nav.isMember && !cancelled && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "member",
      size: "sm"
    }, "Member price ", e.memberPrice ? '£' + e.memberPrice : 'free')),
    description: e.description,
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MetaItem, {
      icon: "calendar-days"
    }, e.date), /*#__PURE__*/React.createElement(MetaItem, {
      icon: "clock"
    }, e.time), /*#__PURE__*/React.createElement(MetaItem, {
      icon: "map-pin"
    }, e.location), /*#__PURE__*/React.createElement(MetaItem, {
      icon: "banknote"
    }, e.price))
  }), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)',
      alignSelf: 'center',
      marginRight: 8
    }
  }, "Preview state:"), window.HM.events.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.id,
    type: "button",
    onClick: () => setWhich(x.id),
    style: {
      minHeight: 32,
      padding: '0 12px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      border: '1px solid ' + (x.id === which ? 'var(--olive-500)' : 'var(--border-default)'),
      background: x.id === which ? 'var(--olive-50)' : 'var(--surface-card)',
      color: x.id === which ? 'var(--olive-700)' : 'var(--text-muted)',
      font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)'
    }
  }, x.availability))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1fr 360px' : '1fr',
      gap: 'var(--space-10)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, cancelled && /*#__PURE__*/React.createElement(Alert, {
    tone: "danger",
    title: "This event has been cancelled"
  }, "Everyone who booked has been refunded in full and emailed. Nothing further is needed from you."), soldout && /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "This event is sold out"
  }, "Join the waiting list and we will email you if a place is returned."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h2)'
    }
  }, "About this event"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)'
    }
  }, e.description), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)'
    }
  }, "Doors open thirty minutes before the start. The bar in the Great Hall stays open until close, and the exhibition galleries remain accessible throughout.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Collections featured"), /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 2,
    tablet: 2,
    mobile: 1
  }, window.HM.collections.slice(2, 4).map(c2 => /*#__PURE__*/React.createElement(CollectionCard, {
    key: c2.id,
    name: c2.name,
    category: c2.category,
    period: c2.period,
    description: c2.description,
    itemCount: c2.items,
    tone: c2.tone
  }))))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: mode === 'desktop' ? 'sticky' : 'static',
      top: 100,
      display: 'grid',
      gap: 'var(--space-4)',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Tickets"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-3xl)/1 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, e.free ? 'Free' : '£' + e.priceValue), !e.free && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--gold-700)'
    }
  }, "Members \xA3", e.memberPrice), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      padding: 'var(--space-4) 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(MetaItem, {
    icon: "calendar-days"
  }, e.date), /*#__PURE__*/React.createElement(MetaItem, {
    icon: "clock"
  }, e.time), /*#__PURE__*/React.createElement(MetaItem, {
    icon: "map-pin"
  }, e.location), /*#__PURE__*/React.createElement(MetaItem, {
    icon: "users"
  }, e.remaining, " of ", e.capacity, " places left")), cancelled ? /*#__PURE__*/React.createElement(Button, {
    disabled: true,
    fullWidth: true
  }, "Event cancelled") : soldout ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true
  }, "Join the waiting list"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "We release returns 48 hours before.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    onClick: () => nav.go('Tickets')
  }, e.free ? 'Reserve a place' : 'Book tickets'), nav.isMember && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      font: 'var(--type-body-sm)',
      color: 'var(--gold-700)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    size: 15
  }), "Your member price is applied at checkout"))))));
}
Object.assign(window, {
  EventsScreen,
  EventDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/EventScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  CollectionCard,
  EventCard,
  RecommendationCard,
  Icon,
  StatusBadge,
  Media
} = window.HeritageMuseumDesignSystem_5a5154;
function Hero({
  mode,
  go
}) {
  const e = window.HM.events.find(x => x.id === 'beneath');
  const small = mode === 'mobile';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--green-900)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    },
    className: "hm-hero-bg"
  }, /*#__PURE__*/React.createElement(Media, {
    tone: "green",
    ratio: "auto",
    radius: "0",
    caption: "Exhibition photography \u2014 Great Hall",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: small ? 'var(--scrim-image)' : 'var(--scrim-hero)'
    }
  })), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hm-hero-in",
    style: {
      maxWidth: small ? '100%' : 560,
      padding: small ? 'var(--space-16) 0 var(--space-10)' : 'var(--space-24) 0',
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--sand-300)'
    }
  }, "Current exhibition"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: small ? 'var(--weight-regular) var(--text-4xl)/1.05 var(--font-display)' : 'var(--weight-regular) var(--text-6xl)/1.05 var(--font-display)',
      color: 'var(--paper-50)'
    }
  }, e.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      fontSize: small ? 16 : 18,
      color: 'rgba(245,243,233,.86)',
      maxWidth: 480
    }
  }, e.description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'center',
      font: 'var(--type-body-sm)',
      color: 'var(--sand-300)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 16
  }), "3 Jul 2026 \u2013 3 Jan 2027"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 16
  }), "Exhibition Wing")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    className: "hm-sheen",
    variant: "accent",
    size: small ? 'md' : 'lg',
    onClick: () => go('Collection')
  }, "Explore exhibition"), /*#__PURE__*/React.createElement(Button, {
    className: "hm-sheen",
    variant: "secondary",
    size: small ? 'md' : 'lg',
    onClick: () => go('Tickets'),
    style: {
      color: 'var(--paper-50)',
      borderColor: 'rgba(242,226,166,.5)'
    }
  }, "Book tickets")))), !small && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 18,
      transform: 'translateX(-50%)',
      display: 'grid',
      justifyItems: 'center',
      gap: 6,
      color: 'var(--sand-300)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      fontSize: 11,
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      opacity: .75
    }
  }, "Scroll"), /*#__PURE__*/React.createElement("span", {
    className: "hm-cue",
    style: {
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 18
  }))));
}
function VisitStrip({
  mode
}) {
  const cells = [{
    icon: 'clock',
    title: 'Open today',
    body: '10:00 – 17:30 · last entry 16:45'
  }, {
    icon: 'ticket',
    title: 'General admission',
    body: 'Free · exhibitions ticketed separately'
  }, {
    icon: 'map-pin',
    title: '18 Lanthorn Street',
    body: 'Six minutes from Lanthorn Bridge station'
  }, {
    icon: 'accessibility',
    title: 'Step-free throughout',
    body: 'BSL tours on the first Saturday'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      borderTop: '1px solid rgba(242,226,166,.18)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : mode === 'tablet' ? '1fr 1fr' : 'repeat(4,1fr)',
      gap: 'var(--space-6)',
      padding: 'var(--space-6) 0'
    }
  }, cells.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 20,
    color: "var(--sand-300)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--paper-50)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, c.title === 'Open today' && /*#__PURE__*/React.createElement("i", {
    className: "hm-dot"
  }), c.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'rgba(245,243,233,.66)'
    }
  }, c.body)))))));
}
function Ticker({
  mode
}) {
  const items = ['Beneath the Lanthorn — now on view', 'Free general admission', 'Members see new exhibitions a week early', 'Curator talk: Reading the Lanthorn Hoard · 24 Sep', 'BSL tours first Saturday of the month'];
  const run = items.concat(items);
  return /*#__PURE__*/React.createElement("div", {
    className: "hm-ticker",
    style: {
      background: 'var(--surface-accent)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: `${mode === 'mobile' ? 10 : 12}px 0`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hm-ticker-track"
  }, run.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: '0 var(--space-6)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)',
      whiteSpace: 'nowrap'
    }
  }, t, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13,
    color: "var(--gold-700)"
  })))));
}
function MembershipPromo({
  mode,
  isMember,
  go
}) {
  return /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    tone: "accent"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1.3fr 1fr' : '1fr',
      gap: 'var(--space-10)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--gold-700)'
    }
  }, isMember ? 'Your membership' : 'Membership'), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h2)'
    }
  }, isMember ? 'Thank you for supporting the museum' : 'See more, pay less, come back often'), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      maxWidth: 520
    }
  }, isMember ? 'Your member price is applied automatically at checkout, and member tickets are held for you until 48 hours before each event.' : 'Members pay a reduced price on every ticketed event, book from a reserved allocation, and see new exhibitions a week early.'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, isMember ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "member"
  }, "Active member"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => go('Membership')
  }, "View your benefits")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    className: "hm-sheen",
    onClick: () => go('Membership')
  }, "Become a member"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => go('Membership')
  }, "Compare benefits")))), mode === 'desktop' && /*#__PURE__*/React.createElement(Media, {
    ratio: "4 / 3",
    tone: "sand",
    caption: "Members' evening, Great Hall"
  })));
}
function HomeScreen({
  mode,
  nav
}) {
  const {
    collections,
    events
  } = window.HM;
  const signedIn = !!nav.user;
  const recs = [{
    title: 'Ice Age Britain',
    kind: 'Collection',
    reason: 'Because you explored Prehistory',
    tone: 'olive'
  }, {
    title: 'Age of Dinosaurs',
    kind: 'Collection',
    reason: 'Similar to the fossils you viewed',
    tone: 'green'
  }, {
    title: 'Curator talk: Reading the Lanthorn Hoard',
    kind: 'Event',
    reason: 'Archaeology, near you this month',
    tone: 'stone'
  }, {
    title: 'Coin & Currency',
    kind: 'Collection',
    reason: 'Often viewed with The Lanthorn Hoard',
    tone: 'sand'
  }];
  const popular = [{
    title: 'The Lanthorn Hoard',
    kind: 'Collection',
    reason: 'Most visited this month',
    tone: 'stone'
  }, {
    title: 'Age of Dinosaurs',
    kind: 'Collection',
    reason: 'Popular with families',
    tone: 'green'
  }, {
    title: 'Twilight at the Museum',
    kind: 'Event',
    reason: 'Selling quickly',
    tone: 'olive'
  }, {
    title: 'Medieval Armoury',
    kind: 'Collection',
    reason: 'Trending this week',
    tone: 'sand'
  }];
  const rail = signedIn ? recs : popular;
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Home'
    }
  }, /*#__PURE__*/React.createElement(Hero, {
    mode: mode,
    go: nav.go
  }), /*#__PURE__*/React.createElement(VisitStrip, {
    mode: mode
  }), /*#__PURE__*/React.createElement(Ticker, {
    mode: mode
  }), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    eyebrow: "Collections",
    title: "Featured collections",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => nav.go('Collections')
    }, "All collections")
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 3,
    tablet: 2,
    mobile: 1
  }, collections.slice(0, 3).map(c => /*#__PURE__*/React.createElement(CollectionCard, {
    key: c.id,
    name: c.name,
    category: c.category,
    period: c.period,
    description: c.description,
    itemCount: c.items,
    tone: c.tone,
    onClick: () => nav.go('Collection')
  })))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    tone: "muted",
    eyebrow: "What's on",
    title: "Events and exhibitions",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => nav.go('Events')
    }, "See what's on")
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 3,
    tablet: 2,
    mobile: 1
  }, events.slice(0, 3).map(e => /*#__PURE__*/React.createElement(EventCard, {
    key: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    location: e.location,
    price: e.price,
    free: e.free,
    availability: e.availability,
    onBook: () => nav.go('Tickets')
  })))), /*#__PURE__*/React.createElement(Section, {
    mode: mode,
    eyebrow: signedIn ? 'For you' : 'Popular right now',
    title: signedIn ? `Recommended for ${nav.user.name.split(' ')[0]}` : 'What other visitors are exploring'
  }, /*#__PURE__*/React.createElement(Grid, {
    mode: mode,
    desktop: 2,
    tablet: 2,
    mobile: 1
  }, rail.map(r => /*#__PURE__*/React.createElement(RecommendationCard, _extends({
    key: r.title
  }, r, {
    reason: signedIn ? r.reason : undefined
  })))), !signedIn && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-6)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      nav.go('SignIn');
    }
  }, "Sign in"), " to see recommendations based on what you have explored.")), /*#__PURE__*/React.createElement(MembershipPromo, {
    mode: mode,
    isMember: nav.isMember,
    go: nav.go
  }));
}
Object.assign(window, {
  HomeScreen,
  Hero,
  VisitStrip,
  MembershipPromo,
  Ticker
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/Motion.jsx
try { (() => {
// Scroll-reveal helpers for the visitor website.
function useInView(options) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.08,
      ...options
    });
    io.observe(el);
    // Anything already on screen at mount reveals immediately.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) setSeen(true);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

// Wraps children in a rise-and-fade block that plays once when scrolled into view.
function Reveal({
  delay = 0,
  as = 'div',
  style,
  className = '',
  children
}) {
  const [ref, seen] = useInView();
  return React.createElement(as, {
    ref,
    className: `hm-rise ${seen ? 'is-in' : ''} ${className}`.trim(),
    style: {
      '--d': `${delay}ms`,
      ...style
    }
  }, children);
}
Object.assign(window, {
  useInView,
  Reveal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/Motion.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/Shell.jsx
try { (() => {
const {
  SiteHeader,
  SiteFooter,
  Drawer,
  Button,
  Icon,
  SearchField
} = window.HeritageMuseumDesignSystem_5a5154;
const PAD = {
  desktop: 'var(--container-pad-desktop)',
  tablet: 'var(--container-pad-tablet)',
  mobile: 'var(--container-pad-mobile)'
};
function Container({
  mode,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: `0 ${PAD[mode]}`,
      ...style
    }
  }, children);
}
function Section({
  mode,
  title,
  eyebrow,
  action,
  children,
  tone,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: tone === 'muted' ? 'var(--surface-sunken)' : tone === 'accent' ? 'var(--surface-accent)' : 'transparent',
      padding: `${mode === 'mobile' ? 'var(--space-10)' : 'var(--space-16)'} 0`,
      ...style
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode
  }, (title || action) && /*#__PURE__*/React.createElement(Reveal, {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--olive-600)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    className: "hm-ruled",
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-2xl)/1.2 var(--font-display)' : 'var(--type-h2)'
    }
  }, title)), action), /*#__PURE__*/React.createElement(Reveal, {
    delay: 110
  }, children)));
}
function Grid({
  mode,
  desktop = 3,
  tablet = 2,
  mobile = 1,
  children,
  style,
  className = ''
}) {
  const cols = mode === 'mobile' ? mobile : mode === 'tablet' ? tablet : desktop;
  return /*#__PURE__*/React.createElement("div", {
    className: `hm-lift ${className}`.trim(),
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
      gap: 'var(--space-5)',
      ...style
    }
  }, children);
}
function MobileNav({
  open,
  onClose,
  onNavigate,
  user,
  isMember
}) {
  const items = ['Home', 'Collections', 'Events', 'Visit', 'Tickets', 'Membership'];
  return /*#__PURE__*/React.createElement(Drawer, {
    open: open,
    side: "left",
    title: "Menu",
    onClose: onClose,
    size: 300,
    footer: user ? /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      variant: "secondary",
      onClick: () => {
        onNavigate('Profile');
        onClose();
      }
    }, "Your account") : /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      onClick: () => {
        onNavigate('SignIn');
        onClose();
      }
    }, "Sign in")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    id: "m-search",
    size: "sm",
    placeholder: "Search the museum",
    style: {
      marginBottom: 'var(--space-3)'
    }
  }), items.map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    onClick: () => {
      onNavigate(i);
      onClose();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 52,
      padding: '0 var(--space-3)',
      border: 0,
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      cursor: 'pointer',
      font: 'var(--weight-medium) var(--text-md)/1 var(--font-body)',
      color: 'var(--text-heading)'
    }
  }, i, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--text-muted)"
  }))), isMember && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      padding: 'var(--space-3)',
      background: 'var(--surface-accent)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    size: 18,
    color: "var(--gold-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)'
    }
  }, "Member since 2024"))));
}
function Page({
  mode,
  nav,
  children
}) {
  const [menu, setMenu] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--surface-page)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    mode: mode,
    active: nav.active,
    user: nav.user,
    isMember: nav.isMember,
    onNavigate: nav.go,
    onSignIn: () => nav.go('SignIn'),
    onMenu: () => setMenu(true),
    onSearch: () => nav.go('Collections')
  }), /*#__PURE__*/React.createElement("main", null, children), /*#__PURE__*/React.createElement(SiteFooter, null), /*#__PURE__*/React.createElement(MobileNav, {
    open: menu,
    onClose: () => setMenu(false),
    onNavigate: nav.go,
    user: nav.user,
    isMember: nav.isMember
  }));
}
Object.assign(window, {
  Container,
  Section,
  Grid,
  Page,
  MobileNav,
  PAD
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/TicketingScreens.jsx
try { (() => {
const {
  Button,
  QuantityStepper,
  StatusBadge,
  Icon,
  Field,
  Input,
  Select,
  Checkbox,
  Alert,
  RadioGroup,
  Media
} = window.HeritageMuseumDesignSystem_5a5154;
const money = n => '£' + n.toFixed(2);
function Steps({
  step,
  mode
}) {
  const labels = ['Tickets', 'Checkout', 'Payment', 'Confirmation'];
  return /*#__PURE__*/React.createElement("ol", {
    style: {
      display: 'flex',
      gap: mode === 'mobile' ? 'var(--space-3)' : 'var(--space-6)',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      flexWrap: 'wrap'
    }
  }, labels.map((l, i) => {
    const done = i < step,
      on = i === step;
    return /*#__PURE__*/React.createElement("li", {
      key: l,
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'grid',
        placeItems: 'center',
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: done ? 'var(--olive-500)' : on ? 'var(--green-900)' : 'var(--paper-200)',
        color: done || on ? 'var(--paper-50)' : 'var(--text-muted)',
        font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)'
      }
    }, done ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 13
    }) : i + 1), (mode !== 'mobile' || on) && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)',
        color: on ? 'var(--text-heading)' : 'var(--text-muted)'
      }
    }, l), i < labels.length - 1 && mode !== 'mobile' && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 14,
      color: "var(--neutral-400)"
    }));
  }));
}
function FlowFrame({
  mode,
  step,
  title,
  children,
  aside,
  nav
}) {
  return /*#__PURE__*/React.createElement(Page, {
    mode: mode,
    nav: {
      ...nav,
      active: 'Tickets'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: 'var(--space-5) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement(Steps, {
    step: step,
    mode: mode
  }))), /*#__PURE__*/React.createElement(Container, {
    mode: mode,
    style: {
      padding: mode === 'mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: mode === 'mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)',
      marginBottom: 'var(--space-8)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'desktop' ? '1fr 360px' : '1fr',
      gap: 'var(--space-10)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, children), aside)));
}
function Summary({
  lines,
  total,
  mode,
  footer,
  note
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: mode === 'desktop' ? 'sticky' : 'static',
      top: 100,
      display: 'grid',
      gap: 'var(--space-4)',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Order summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, lines.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.label,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      font: 'var(--type-body-sm)',
      color: l.muted ? 'var(--text-muted)' : 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, l.icon && /*#__PURE__*/React.createElement(Icon, {
    name: l.icon,
    size: 14,
    color: "var(--gold-700)"
  }), l.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: l.tone === 'discount' ? 'var(--success-600)' : undefined,
      fontWeight: l.strong ? 'var(--weight-semibold)' : undefined
    }
  }, l.value)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, "Total to pay"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-2xl)/1 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, total)), note && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, note), footer);
}
function useOrder(isMember) {
  const [qty, setQty] = React.useState({
    general: 2,
    member: 0,
    child: 0
  });
  const prices = {
    general: 14,
    member: 10,
    child: 7
  };
  const sub = qty.general * prices.general + qty.member * prices.member + qty.child * prices.child;
  const fee = sub ? 1.5 : 0;
  const vat = +(sub * 0.05).toFixed(2);
  const discount = isMember && qty.general ? +(qty.general * 2).toFixed(2) : 0;
  const total = +(sub + fee + vat - discount).toFixed(2);
  const count = qty.general + qty.member + qty.child;
  return {
    qty,
    setQty,
    prices,
    sub,
    fee,
    vat,
    discount,
    total,
    count
  };
}
function TicketSelectScreen({
  mode,
  nav,
  order
}) {
  const e = window.HM.events[0];
  const types = [{
    key: 'general',
    name: 'General admission',
    desc: 'Adult, 18 and over',
    price: 14,
    remaining: 38
  }, {
    key: 'member',
    name: 'Member admission',
    desc: 'Requires an active membership',
    price: 10,
    remaining: 20,
    member: true
  }, {
    key: 'child',
    name: 'Child or student',
    desc: 'Under 18, or with a valid student card',
    price: 7,
    remaining: 38
  }];
  return /*#__PURE__*/React.createElement(FlowFrame, {
    mode: mode,
    nav: nav,
    step: 0,
    title: "Choose your tickets",
    aside: /*#__PURE__*/React.createElement(Summary, {
      mode: mode,
      lines: [{
        label: `General admission × ${order.qty.general}`,
        value: money(order.qty.general * 14)
      }, {
        label: `Member admission × ${order.qty.member}`,
        value: money(order.qty.member * 10),
        muted: !order.qty.member
      }, {
        label: `Child or student × ${order.qty.child}`,
        value: money(order.qty.child * 7),
        muted: !order.qty.child
      }],
      total: money(order.sub),
      note: "Fees and any member discount are shown at checkout.",
      footer: /*#__PURE__*/React.createElement(Button, {
        fullWidth: true,
        size: "lg",
        disabled: !order.count,
        onClick: () => nav.go('Checkout')
      }, "Continue to checkout")
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-lg)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Media, {
    ratio: "4 / 3",
    tone: "green",
    caption: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, e.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)'
    }
  }, e.date, " \xB7 ", e.time, " \xB7 ", e.location), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "warning",
    size: "sm"
  }, e.remaining, " places left"), nav.isMember && /*#__PURE__*/React.createElement(StatusBadge, {
    tone: "member",
    size: "sm"
  }, "20 held for members")))), !nav.isMember && /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Members pay \xA310",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => nav.go('Membership')
    }, "See membership")
  }, "Membership pays for itself in four visits, and member tickets are held until 48 hours before."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, types.map(t => {
    const locked = t.member && !nav.isMember;
    return /*#__PURE__*/React.createElement("div", {
      key: t.key,
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-5)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        opacity: locked ? .6 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 4,
        minWidth: 200
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        font: 'var(--type-label)',
        color: 'var(--text-heading)'
      }
    }, t.name, t.member && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "member",
      size: "sm"
    }, "Members only")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-muted)'
      }
    }, locked ? 'Sign in with a membership to unlock this price' : t.desc)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-6)',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--text-md)/1 var(--font-body)',
        color: 'var(--text-heading)'
      }
    }, money(t.price)), /*#__PURE__*/React.createElement(QuantityStepper, {
      label: t.name,
      value: order.qty[t.key],
      max: Math.min(6, t.remaining),
      disabled: locked,
      onChange: v => order.setQty(q => ({
        ...q,
        [t.key]: v
      }))
    })));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "Free events are reserved the same way \u2014 you will not be asked for payment details."));
}
function CheckoutScreen({
  mode,
  nav,
  order
}) {
  return /*#__PURE__*/React.createElement(FlowFrame, {
    mode: mode,
    nav: nav,
    step: 1,
    title: "Check your order",
    aside: /*#__PURE__*/React.createElement(Summary, {
      mode: mode,
      lines: [{
        label: `General admission × ${order.qty.general}`,
        value: money(order.qty.general * 14)
      }, {
        label: `Child or student × ${order.qty.child}`,
        value: money(order.qty.child * 7),
        muted: !order.qty.child
      }, {
        label: 'Subtotal',
        value: money(order.sub),
        strong: true
      }, {
        label: 'Service charge',
        value: money(order.fee)
      }, {
        label: 'VAT (5%)',
        value: money(order.vat)
      }, ...(order.discount ? [{
        label: 'Member discount',
        value: '−' + money(order.discount),
        tone: 'discount',
        icon: 'award'
      }] : [])],
      total: money(order.total),
      footer: /*#__PURE__*/React.createElement(Button, {
        fullWidth: true,
        size: "lg",
        onClick: () => nav.go('Payment')
      }, "Continue to payment"),
      note: "You will not be charged until the next step."
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Your details"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    htmlFor: "cn",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "cn",
    defaultValue: nav.user ? nav.user.name : '',
    placeholder: "Amara Okafor"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "ce",
    required: true,
    hint: "Your tickets are sent here."
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ce",
    type: "email",
    defaultValue: nav.user ? 'amara@example.com' : ''
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Phone",
    htmlFor: "cp",
    optional: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "cp",
    type: "tel"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "How did you hear about us?",
    htmlFor: "ch",
    optional: true
  }, /*#__PURE__*/React.createElement(Select, {
    id: "ch",
    placeholder: "Select an option",
    options: ['Friend or family', 'Social media', 'Newsletter', 'Walked past']
  }))), /*#__PURE__*/React.createElement(Checkbox, {
    id: "nl",
    label: "Email me what's on",
    description: "Monthly, and never shared."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Access requirements"), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "acc",
    value: "none",
    options: [{
      value: 'none',
      label: 'No requirements'
    }, {
      value: 'wheel',
      label: 'Wheelchair space needed'
    }, {
      value: 'bsl',
      label: 'BSL interpretation'
    }]
  })), nav.isMember && /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Member discount applied"
  }, "\xA3", order.discount.toFixed(2), " has been taken off this order."));
}
function PaymentScreen({
  mode,
  nav,
  order
}) {
  const [state, setState] = React.useState('idle');
  const free = order.total === 0;
  return /*#__PURE__*/React.createElement(FlowFrame, {
    mode: mode,
    nav: nav,
    step: 2,
    title: free ? 'Confirm your free tickets' : 'Payment',
    aside: /*#__PURE__*/React.createElement(Summary, {
      mode: mode,
      lines: [{
        label: `${order.count} tickets`,
        value: money(order.sub)
      }, {
        label: 'Service charge',
        value: money(order.fee)
      }, {
        label: 'VAT (5%)',
        value: money(order.vat)
      }, ...(order.discount ? [{
        label: 'Member discount',
        value: '−' + money(order.discount),
        tone: 'discount',
        icon: 'award'
      }] : [])],
      total: money(order.total),
      footer: /*#__PURE__*/React.createElement(Button, {
        fullWidth: true,
        size: "lg",
        loading: state === 'loading',
        onClick: () => {
          setState('loading');
          setTimeout(() => nav.go('Confirmation'), 700);
        }
      }, free ? 'Confirm reservation' : 'Pay ' + money(order.total))
    })
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Prototype payment screen"
  }, "No card is charged. Use the buttons below to preview the success and failure states."), state === 'failed' && /*#__PURE__*/React.createElement(Alert, {
    tone: "danger",
    title: "Payment declined",
    onDismiss: () => setState('idle')
  }, "Your card was not charged. Check the number and expiry date, or try another card."), free ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "No payment needed"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)'
    }
  }, "This event is free. We only need your email so we can send the tickets and let you know if anything changes.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Card details"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14
  }), "Secure form")), /*#__PURE__*/React.createElement(Field, {
    label: "Cardholder name",
    htmlFor: "p1",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p1",
    placeholder: "As printed on the card"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Card number",
    htmlFor: "p2",
    required: true,
    error: state === 'failed' ? 'This card was declined' : undefined
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p2",
    inputMode: "numeric",
    placeholder: "4242 4242 4242 4242",
    invalid: state === 'failed',
    iconLeft: "credit-card"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Expiry",
    htmlFor: "p3",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p3",
    placeholder: "MM / YY"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Security code",
    htmlFor: "p4",
    required: true,
    hint: "Three digits on the back"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p4",
    placeholder: "123"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Billing postcode",
    htmlFor: "p5",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p5",
    placeholder: "SE1 4XN"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      paddingTop: 'var(--space-2)',
      borderTop: '1px dashed var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => nav.go('Confirmation')
  }, "Preview successful payment"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setState('failed')
  }, "Preview failed payment"))));
}
function ConfirmationScreen({
  mode,
  nav,
  order
}) {
  const e = window.HM.events[0];
  return /*#__PURE__*/React.createElement(FlowFrame, {
    mode: mode,
    nav: nav,
    step: 3,
    title: "You're going",
    aside: /*#__PURE__*/React.createElement(Summary, {
      mode: mode,
      lines: [{
        label: `${order.count} tickets`,
        value: money(order.sub)
      }, {
        label: 'Service charge',
        value: money(order.fee)
      }, {
        label: 'VAT (5%)',
        value: money(order.vat)
      }, ...(order.discount ? [{
        label: 'Member discount',
        value: '−' + money(order.discount),
        tone: 'discount',
        icon: 'award'
      }] : [])],
      total: money(order.total),
      note: "A receipt has been emailed to you.",
      footer: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gap: 'var(--space-3)'
        }
      }, /*#__PURE__*/React.createElement(Button, {
        fullWidth: true,
        onClick: () => nav.go('Profile')
      }, "View my tickets"), /*#__PURE__*/React.createElement(Button, {
        fullWidth: true,
        variant: "secondary",
        onClick: () => nav.go('Events')
      }, "Back to events"))
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start',
      padding: 'var(--space-6)',
      background: 'var(--success-100)',
      border: '1px solid #A8CDB4',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle-2",
    size: 28,
    color: "#2C5C39"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h3)',
      color: '#2C5C39'
    }
  }, "Booking confirmed"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-body)'
    }
  }, "We have emailed your tickets to amara@example.com. Show the QR code on your phone at the entrance."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mode === 'mobile' ? '1fr' : '1fr 180px',
      gap: 'var(--space-6)',
      alignItems: 'center',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Booking reference"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-2xl)/1 var(--font-display)',
      color: 'var(--text-heading)',
      letterSpacing: '.04em'
    }
  }, "HM-2026-04821"), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 'var(--space-2) var(--space-5)',
      margin: 0,
      font: 'var(--type-body-sm)'
    }
  }, [['Event', e.title], ['Date', e.date + ' · ' + e.time], ['Location', e.location], ['Tickets', `${order.count} × general admission`], ['Total paid', money(order.total)], ['Booked by', nav.user ? nav.user.name : 'Amara Okafor']].map(([k, v]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: k
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      color: 'var(--text-heading)'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      height: 140,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "qr-code",
    size: 92,
    color: "var(--green-900)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "Placeholder QR"))));
}
Object.assign(window, {
  TicketSelectScreen,
  CheckoutScreen,
  PaymentScreen,
  ConfirmationScreen,
  useOrder,
  Steps,
  Summary,
  money
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/TicketingScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/VisitorApp.jsx
try { (() => {
const {
  Icon
} = window.HeritageMuseumDesignSystem_5a5154;
const SCREENS = [{
  key: 'Home',
  label: 'Home',
  group: 'Public'
}, {
  key: 'Collections',
  label: 'Collections browse',
  group: 'Public'
}, {
  key: 'Collection',
  label: 'Collection detail',
  group: 'Public'
}, {
  key: 'Item',
  label: 'Artefact detail',
  group: 'Public'
}, {
  key: 'Events',
  label: "What's on",
  group: 'Public'
}, {
  key: 'Event',
  label: 'Event detail',
  group: 'Public'
}, {
  key: 'Tickets',
  label: 'Ticket selection',
  group: 'Ticketing'
}, {
  key: 'Checkout',
  label: 'Checkout',
  group: 'Ticketing'
}, {
  key: 'Payment',
  label: 'Payment',
  group: 'Ticketing'
}, {
  key: 'Confirmation',
  label: 'Confirmation',
  group: 'Ticketing'
}, {
  key: 'SignIn',
  label: 'Sign in',
  group: 'Account'
}, {
  key: 'Register',
  label: 'Register',
  group: 'Account'
}, {
  key: 'Interests',
  label: 'Interests onboarding',
  group: 'Account'
}, {
  key: 'Profile',
  label: 'Profile',
  group: 'Account'
}, {
  key: 'Membership',
  label: 'Membership',
  group: 'Account'
}];
const WIDTHS = {
  desktop: 1440,
  tablet: 768,
  mobile: 390
};
function Toolbar({
  screen,
  setScreen,
  mode,
  setMode,
  who,
  setWho
}) {
  const seg = (opts, value, onChange) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 3,
      background: 'var(--paper-200)',
      borderRadius: 'var(--radius-pill)'
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    onClick: () => onChange(o.value),
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      minHeight: 32,
      padding: '0 12px',
      borderRadius: 'var(--radius-pill)',
      border: 0,
      cursor: 'pointer',
      background: value === o.value ? 'var(--surface-card)' : 'transparent',
      boxShadow: value === o.value ? 'var(--shadow-xs)' : 'none',
      color: value === o.value ? 'var(--text-heading)' : 'var(--text-muted)',
      font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)'
    }
  }, o.icon && /*#__PURE__*/React.createElement(Icon, {
    name: o.icon,
    size: 14
  }), o.label)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: 'var(--space-3) var(--space-5)',
      background: 'var(--paper-100)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Visitor website"), /*#__PURE__*/React.createElement("select", {
    value: screen,
    onChange: e => setScreen(e.target.value),
    "aria-label": "Screen",
    style: {
      minHeight: 34,
      padding: '0 10px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)'
    }
  }, ['Public', 'Ticketing', 'Account'].map(g => /*#__PURE__*/React.createElement("optgroup", {
    key: g,
    label: g
  }, SCREENS.filter(s => s.group === g).map(s => /*#__PURE__*/React.createElement("option", {
    key: s.key,
    value: s.key
  }, s.label))))), seg([{
    value: 'desktop',
    label: '1440',
    icon: 'monitor'
  }, {
    value: 'tablet',
    label: '768',
    icon: 'tablet'
  }, {
    value: 'mobile',
    label: '390',
    icon: 'smartphone'
  }], mode, setMode), seg([{
    value: 'anon',
    label: 'Anonymous'
  }, {
    value: 'user',
    label: 'Registered'
  }, {
    value: 'member',
    label: 'Member'
  }], who, setWho));
}
function Frame({
  mode,
  children
}) {
  const w = WIDTHS[mode];
  const box = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      if (box.current) setScale(Math.min(1, (box.current.clientWidth - 32) / w));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w]);
  return /*#__PURE__*/React.createElement("div", {
    ref: box,
    style: {
      padding: 'var(--space-5)',
      background: 'var(--paper-200)',
      minHeight: '100%',
      display: 'grid',
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w * scale,
      height: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: 'var(--surface-page)',
      borderRadius: mode === 'mobile' ? 24 : 8,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }
  }, children)));
}
function App() {
  const [screen, setScreen] = React.useState('Home');
  const [mode, setMode] = React.useState('desktop');
  const [who, setWho] = React.useState('anon');
  const order = useOrder(who === 'member');
  const user = who === 'anon' ? undefined : {
    name: 'Amara Okafor',
    initials: 'AO'
  };
  const nav = {
    user,
    isMember: who === 'member',
    go: setScreen,
    signIn: () => {
      setWho('user');
      setScreen('Home');
    },
    signOut: () => {
      setWho('anon');
      setScreen('Home');
    },
    setMember: v => setWho(v ? 'member' : 'user')
  };
  const props = {
    mode,
    nav,
    order
  };
  const map = {
    Home: HomeScreen,
    Collections: CollectionsScreen,
    Collection: CollectionDetailScreen,
    Item: ItemDetailScreen,
    Events: EventsScreen,
    Event: EventDetailScreen,
    Tickets: TicketSelectScreen,
    Checkout: CheckoutScreen,
    Payment: PaymentScreen,
    Confirmation: ConfirmationScreen,
    SignIn: SignInScreen,
    Register: RegisterScreen,
    Interests: InterestsScreen,
    Profile: ProfileScreen,
    Membership: MembershipScreen
  };
  const Screen = map[screen] || HomeScreen;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--paper-200)'
    }
  }, /*#__PURE__*/React.createElement(Toolbar, {
    screen: screen,
    setScreen: setScreen,
    mode: mode,
    setMode: setMode,
    who: who,
    setWho: setWho
  }), /*#__PURE__*/React.createElement(Frame, {
    mode: mode,
    key: mode
  }, /*#__PURE__*/React.createElement("div", {
    className: "hm-screen",
    key: screen + who
  }, /*#__PURE__*/React.createElement(Screen, props))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/VisitorApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/visitor_site/data.js
try { (() => {
window.HM = {
  collections: [{
    id: 'ice-age',
    name: 'Ice Age Britain',
    category: 'Prehistory',
    period: 'Pleistocene',
    items: 128,
    tone: 'olive',
    description: 'Mammoth, aurochs and the first people to cross the land bridge.',
    location: 'Gallery 1 · Ground floor'
  }, {
    id: 'dinosaurs',
    name: 'Age of Dinosaurs',
    category: 'Dinosaurs',
    period: 'Mesozoic',
    items: 96,
    tone: 'green',
    description: 'Fossils and reconstructions from the Jurassic and Cretaceous.',
    location: 'Gallery 2 · Ground floor'
  }, {
    id: 'lanthorn',
    name: 'The Lanthorn Hoard',
    category: 'Archaeology',
    period: 'Iron Age',
    items: 92,
    tone: 'stone',
    description: 'Ninety-two objects buried in the third century BCE.',
    location: 'Gallery 4 · First floor'
  }, {
    id: 'armoury',
    name: 'Medieval Armoury',
    category: 'Medieval',
    period: '1100–1450',
    items: 41,
    tone: 'green',
    description: 'Arms, armour and the craft of the medieval smith.',
    location: 'Gallery 7 · First floor'
  }, {
    id: 'portraits',
    name: 'Renaissance Portraits',
    category: 'Renaissance',
    period: '1400–1600',
    items: 64,
    tone: 'sand',
    description: 'Faces of merchants, scholars and their households.',
    location: 'Gallery 9 · Second floor'
  }, {
    id: 'ceramics',
    name: 'Ancient Ceramics',
    category: 'Ancient History',
    period: '800 BCE–200 CE',
    items: 210,
    tone: 'stone',
    description: 'Vessels for grain, wine, oil and the dead.',
    location: 'Gallery 5 · First floor'
  }, {
    id: 'birds',
    name: 'Birds of the Estuary',
    category: 'Art',
    period: '19th century',
    items: 37,
    tone: 'olive',
    description: 'Watercolours and specimens from the Lanthorn marshes.',
    location: 'Gallery 11 · Second floor'
  }, {
    id: 'coins',
    name: 'Coin & Currency',
    category: 'Archaeology',
    period: 'Roman–Georgian',
    items: 480,
    tone: 'sand',
    description: 'Two thousand years of money made and spent locally.',
    location: 'Gallery 6 · First floor'
  }],
  items: [{
    id: 'helmet',
    name: 'Bronze ceremonial helmet',
    period: 'Iron Age',
    date: 'c. 300 BCE',
    origin: 'Lanthorn Fields, Kent',
    description: 'Cast in one piece and never worn in battle.',
    collection: 'The Lanthorn Hoard',
    location: 'Case 4A, Gallery 4'
  }, {
    id: 'torc',
    name: 'Gold neck torc',
    period: 'Iron Age',
    date: 'c. 280 BCE',
    origin: 'Lanthorn Fields, Kent',
    description: 'Twisted from eight rods of high-purity gold.',
    collection: 'The Lanthorn Hoard',
    location: 'Case 4A, Gallery 4'
  }, {
    id: 'bowl',
    name: 'Ritual bowl with boar frieze',
    period: 'Iron Age',
    date: 'c. 300 BCE',
    origin: 'Lanthorn Fields, Kent',
    description: 'Repoussé decoration showing a boar hunt.',
    collection: 'The Lanthorn Hoard',
    location: 'Case 4B, Gallery 4'
  }, {
    id: 'brooch',
    name: 'Enamelled disc brooch',
    period: 'Iron Age',
    date: 'c. 250 BCE',
    origin: 'Unknown',
    description: 'Red and blue enamel set in bronze cells.',
    collection: 'The Lanthorn Hoard',
    location: 'Case 4C, Gallery 4'
  }, {
    id: 'sword',
    name: 'Iron sword with wooden grip',
    period: 'Iron Age',
    date: 'c. 320 BCE',
    origin: 'Lanthorn Fields, Kent',
    description: 'Bent double before burial — a deliberate act.',
    collection: 'The Lanthorn Hoard',
    location: 'Case 4D, Gallery 4'
  }, {
    id: 'cauldron',
    name: 'Riveted bronze cauldron',
    period: 'Iron Age',
    date: 'c. 300 BCE',
    origin: 'Lanthorn Fields, Kent',
    description: 'Repaired at least four times in antiquity.',
    collection: 'The Lanthorn Hoard',
    location: 'Case 4E, Gallery 4'
  }],
  events: [{
    id: 'twilight',
    title: 'Twilight at the Museum',
    date: '14 Sep 2026',
    endDate: '14 Sep 2026',
    time: '18:30–21:00',
    location: 'Great Hall',
    price: '£14 · £10 members',
    priceValue: 14,
    memberPrice: 10,
    availability: 'limited',
    remaining: 38,
    capacity: 200,
    description: 'After-hours access to the Great Hall with curator talks, live music and a late bar.'
  }, {
    id: 'hoard-talk',
    title: 'Curator talk: Reading the Lanthorn Hoard',
    date: '21 Sep 2026',
    endDate: '21 Sep 2026',
    time: '13:00–14:00',
    location: 'Lecture Theatre',
    price: 'Free',
    free: true,
    priceValue: 0,
    availability: 'available',
    remaining: 82,
    capacity: 120,
    description: 'Dr Naomi Vale on what ninety-two buried objects tell us about belief.'
  }, {
    id: 'family-fossil',
    title: 'Family fossil workshop',
    date: '27 Sep 2026',
    endDate: '27 Sep 2026',
    time: '10:00–12:30',
    location: 'Learning Studio',
    price: '£8 · £5 members',
    priceValue: 8,
    memberPrice: 5,
    availability: 'soldout',
    remaining: 0,
    capacity: 40,
    description: 'Cast your own ammonite and meet the museum\u2019s palaeontologists.'
  }, {
    id: 'night-drawing',
    title: 'Late-night life drawing',
    date: '2 Oct 2026',
    endDate: '2 Oct 2026',
    time: '19:00–21:00',
    location: 'Gallery 9',
    price: '£18 · £14 members',
    priceValue: 18,
    memberPrice: 14,
    availability: 'cancelled',
    remaining: 0,
    capacity: 30,
    description: 'This session has been cancelled. Ticket holders have been refunded in full.'
  }, {
    id: 'beneath',
    title: 'Beneath the Lanthorn Fields',
    date: '3 Jul 2026',
    endDate: '3 Jan 2027',
    time: 'Daily, 10:00–17:00',
    location: 'Exhibition Wing',
    price: '£16 · £12 members',
    priceValue: 16,
    memberPrice: 12,
    availability: 'available',
    remaining: 640,
    capacity: 1200,
    description: 'Ninety-two objects from a single Iron Age hoard, shown together for the first time since their discovery in 1974.'
  }],
  categories: ['Prehistory', 'Dinosaurs', 'Archaeology', 'Ancient History', 'Medieval', 'Renaissance', 'Art'],
  periods: ['Prehistoric', 'Ancient', 'Medieval', 'Early modern', 'Modern'],
  interests: ['Dinosaurs', 'Prehistory', 'Ancient History', 'Archaeology', 'Medieval', 'Renaissance', 'Art', 'Natural History'],
  bookings: [{
    ref: 'HM-2026-04821',
    event: 'Beneath the Lanthorn Fields',
    date: '12 Aug 2026',
    qty: 2,
    total: '£24.00',
    status: 'Confirmed'
  }, {
    ref: 'HM-2026-04455',
    event: 'Curator talk: Reading the Lanthorn Hoard',
    date: '21 Sep 2026',
    qty: 1,
    total: 'Free',
    status: 'Confirmed'
  }, {
    ref: 'HM-2026-03910',
    event: 'Family fossil workshop',
    date: '4 May 2026',
    qty: 4,
    total: '£20.00',
    status: 'Cancelled'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/visitor_site/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CollectionCard = __ds_scope.CollectionCard;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.ItemCard = __ds_scope.ItemCard;

__ds_ns.RecommendationCard = __ds_scope.RecommendationCard;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.FilterPanel = __ds_scope.FilterPanel;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Drawer = __ds_scope.Drawer;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.SkeletonCard = __ds_scope.SkeletonCard;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.DateTimeField = __ds_scope.DateTimeField;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ImageUpload = __ds_scope.ImageUpload;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Media = __ds_scope.Media;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.StaffSidebar = __ds_scope.StaffSidebar;

__ds_ns.StaffTopBar = __ds_scope.StaffTopBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
