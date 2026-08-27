/* @ds-bundle: {"format":4,"namespace":"HeritageMuseumDesignSystem_5a5154","components":[{"name":"Icon","sourcePath":"components/foundation/Icon.jsx"},{"name":"Logo","sourcePath":"components/foundation/Logo.jsx"},{"name":"Media","sourcePath":"components/foundation/Media.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"DateTimeField","sourcePath":"components/forms/DateTimeField.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"ImageUpload","sourcePath":"components/forms/ImageUpload.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"SkeletonCard","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Drawer","sourcePath":"components/feedback/Drawer.jsx"},{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"CollectionCard","sourcePath":"components/cards/CollectionCard.jsx"},{"name":"EventCard","sourcePath":"components/cards/EventCard.jsx"},{"name":"ItemCard","sourcePath":"components/cards/ItemCard.jsx"},{"name":"RecommendationCard","sourcePath":"components/cards/RecommendationCard.jsx"},{"name":"StatCard","sourcePath":"components/cards/StatCard.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"FilterPanel","sourcePath":"components/data/FilterPanel.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"StaffSidebar","sourcePath":"components/navigation/StaffSidebar.jsx"},{"name":"StaffTopBar","sourcePath":"components/navigation/StaffTopBar.jsx"}]} */
/* Rebuilt locally from the component sources with @babel/preset-react.
   The copy served by the design MCP was truncated at its 192 KB read cap,
   so this bundle is regenerated rather than imported. Re-run
   tools/build-bundle.js after editing any component source to refresh it. */
window.HeritageMuseumDesignSystem_5a5154 = window.HeritageMuseumDesignSystem_5a5154 || {};
(function () {
  "use strict";
  var NS = window.HeritageMuseumDesignSystem_5a5154;
  /* ---- components/foundation/Icon.jsx ---- */
  (function () {
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
      return /*#__PURE__*/React.createElement("span", {
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
        },
        ...rest
      });
    }
    NS.Icon = Icon;
  })();

  /* ---- components/foundation/Logo.jsx ---- */
  (function () {
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
      const img = /*#__PURE__*/React.createElement("img", {
        src: assetBase + SRC[variant],
        alt: "Heritage Museum",
        style: {
          height: h,
          width: 'auto',
          display: 'block',
          ...style
        },
        ...rest
      });
      return href ? /*#__PURE__*/React.createElement("a", {
        href: href,
        style: {
          display: 'inline-flex',
          textDecoration: 'none'
        }
      }, img) : img;
    }
    NS.Logo = Logo;
  })();

  /* ---- components/foundation/Media.jsx ---- */
  (function () {
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
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          aspectRatio: ratio,
          overflow: 'hidden',
          borderRadius: radius,
          background: src ? 'var(--surface-sunken)' : `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
          ...style
        },
        ...rest
      }, src ? /*#__PURE__*/React.createElement("img", {
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
    NS.Media = Media;
  })();

  /* ---- components/forms/Field.jsx ---- */
  (function () {
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
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gap: 'var(--space-2)',
          ...style
        },
        ...rest
      }, label && /*#__PURE__*/React.createElement("label", {
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
      }, "⚠"), error));
    }
    NS.Field = Field;
  })();

  /* ---- components/forms/Input.jsx ---- */
  (function () {
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
      const input = /*#__PURE__*/React.createElement("input", {
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
        },
        ...rest
      });
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
    NS.Input = Input;
  })();

  /* ---- components/forms/Textarea.jsx ---- */
  (function () {
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
      return /*#__PURE__*/React.createElement("textarea", {
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
        },
        ...rest
      });
    }
    NS.Textarea = Textarea;
  })();

  /* ---- components/forms/Select.jsx ---- */
  (function () {
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
      }, /*#__PURE__*/React.createElement("select", {
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
        },
        ...rest
      }, placeholder && /*#__PURE__*/React.createElement("option", {
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
    NS.Select = Select;
  })();

  /* ---- components/forms/RadioGroup.jsx ---- */
  (function () {
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
      return /*#__PURE__*/React.createElement("fieldset", {
        style: {
          border: 0,
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 'var(--space-2)',
          ...style
        },
        ...rest
      }, legend && /*#__PURE__*/React.createElement("legend", {
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
    NS.RadioGroup = RadioGroup;
  })();

  /* ---- components/forms/Button.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement(Tag, {
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
        },
        ...rest
      }, loading && /*#__PURE__*/React.createElement(Icon, {
        name: "loader-circle",
        size: s.icon,
        style: {
          animation: 'hm-spin 900ms linear infinite'
        }
      }), !loading && iconLeft && /*#__PURE__*/React.createElement(Icon, {
        name: iconLeft,
        size: s.icon
      }), children, iconRight && /*#__PURE__*/React.createElement(Icon, {
        name: iconRight,
        size: s.icon
      }));
    }
    NS.Button = Button;
  })();

  /* ---- components/forms/IconButton.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement("button", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement(Icon, {
        name: icon,
        size: size === 'sm' ? 18 : 20
      }));
    }
    NS.IconButton = IconButton;
  })();

  /* ---- components/forms/Checkbox.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      }, /*#__PURE__*/React.createElement("input", {
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
        },
        ...rest
      }), checked && /*#__PURE__*/React.createElement(Icon, {
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
    NS.Checkbox = Checkbox;
  })();

  /* ---- components/forms/SearchField.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 18,
        color: "var(--text-muted)"
      }), /*#__PURE__*/React.createElement("input", {
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
        },
        ...rest
      }), value ? /*#__PURE__*/React.createElement("button", {
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
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "x",
        size: 16,
        color: "var(--text-muted)"
      })) : null));
    }
    NS.SearchField = SearchField;
  })();

  /* ---- components/forms/DateTimeField.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      }, /*#__PURE__*/React.createElement("input", {
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
        },
        ...rest
      }), /*#__PURE__*/React.createElement(Icon, {
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
    NS.DateTimeField = DateTimeField;
  })();

  /* ---- components/forms/QuantityStepper.jsx ---- */
  (function () {
    var IconButton = NS.IconButton;
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
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement(IconButton, {
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
      }), /*#__PURE__*/React.createElement(IconButton, {
        icon: "plus",
        label: `Add one ${label}`,
        variant: "outline",
        onClick: () => set(value + 1),
        disabled: disabled || value >= max
      }));
    }
    NS.QuantityStepper = QuantityStepper;
  })();

  /* ---- components/forms/ImageUpload.jsx ---- */
  (function () {
    var Icon = NS.Icon, Button = NS.Button;
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
        }, "Uploaded")), /*#__PURE__*/React.createElement(Button, {
          variant: "ghost",
          size: "sm",
          iconLeft: "trash-2",
          onClick: onRemove
        }, "Remove"));
      }
      return /*#__PURE__*/React.createElement("div", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement(Icon, {
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
      }, hint)), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm"
      }, "Choose file"));
    }
    NS.ImageUpload = ImageUpload;
  })();

  /* ---- components/feedback/StatusBadge.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement("span", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement(Icon, {
        name: icon || t.icon,
        size: sm ? 11 : 13
      }), children);
    }
    NS.StatusBadge = StatusBadge;
  })();

  /* ---- components/feedback/Alert.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement("div", {
        role: tone === 'danger' ? 'alert' : 'status',
        style: {
          display: 'flex',
          gap: 'var(--space-3)',
          padding: 'var(--space-4)',
          background: t.bg,
          border: `var(--border-width) solid ${t.bd}`,
          borderRadius: 'var(--radius-md)',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement(Icon, {
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
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "x",
        size: 16,
        color: t.fg
      })));
    }
    NS.Alert = Alert;
  })();

  /* ---- components/feedback/EmptyState.jsx ---- */
  (function () {
    var Icon = NS.Icon;
    function EmptyState({
      icon = 'search-x',
      title,
      description,
      action,
      compact,
      style,
      ...rest
    }) {
      return /*#__PURE__*/React.createElement("div", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          placeItems: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--olive-50)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
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
    NS.EmptyState = EmptyState;
  })();

  /* ---- components/feedback/Skeleton.jsx ---- */
  (function () {
    function Skeleton({
      width = '100%',
      height = 16,
      radius = 'var(--radius-sm)',
      style,
      ...rest
    }) {
      return /*#__PURE__*/React.createElement("span", {
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
        },
        ...rest
      });
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
    NS.Skeleton = Skeleton; NS.SkeletonCard = SkeletonCard;
  })();

  /* ---- components/feedback/Modal.jsx ---- */
  (function () {
    var IconButton = NS.IconButton;
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
      }, /*#__PURE__*/React.createElement("div", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement("header", {
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
      }, description)), onClose && /*#__PURE__*/React.createElement(IconButton, {
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
    NS.Modal = Modal;
  })();

  /* ---- components/feedback/Drawer.jsx ---- */
  (function () {
    var IconButton = NS.IconButton;
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
      }, /*#__PURE__*/React.createElement("aside", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement("header", {
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
      }, title), onClose && /*#__PURE__*/React.createElement(IconButton, {
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
    NS.Drawer = Drawer;
  })();

  /* ---- components/cards/Card.jsx ---- */
  (function () {
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
      return /*#__PURE__*/React.createElement(Tag, {
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
        },
        ...rest
      }, children);
    }
    NS.Card = Card;
  })();

  /* ---- components/cards/CollectionCard.jsx ---- */
  (function () {
    var Card = NS.Card, Media = NS.Media, StatusBadge = NS.StatusBadge;
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
      return /*#__PURE__*/React.createElement(Card, {
        interactive: true,
        as: "a",
        href: href,
        padding: 0,
        style: style,
        ...rest
      }, /*#__PURE__*/React.createElement(Media, {
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
      }, category && /*#__PURE__*/React.createElement(StatusBadge, {
        tone: "olive",
        size: "sm"
      }, category), period && /*#__PURE__*/React.createElement(StatusBadge, {
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
    NS.CollectionCard = CollectionCard;
  })();

  /* ---- components/cards/EventCard.jsx ---- */
  (function () {
    var Card = NS.Card, Media = NS.Media, StatusBadge = NS.StatusBadge, Icon = NS.Icon, Button = NS.Button;
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
      }, /*#__PURE__*/React.createElement(Icon, {
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
      return /*#__PURE__*/React.createElement(Card, {
        padding: 0,
        interactive: !blocked,
        style: {
          display: row ? 'grid' : 'block',
          gridTemplateColumns: row ? '260px minmax(0,1fr)' : undefined,
          ...style
        },
        ...rest
      }, row ? /*#__PURE__*/React.createElement("div", {
        style: {
          minWidth: 0,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement(Media, {
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
      })) : /*#__PURE__*/React.createElement(Media, {
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
      }, /*#__PURE__*/React.createElement(StatusBadge, {
        tone: a.tone,
        size: "sm"
      }, a.label), free && /*#__PURE__*/React.createElement(StatusBadge, {
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
      }, free ? 'Free entry' : price), /*#__PURE__*/React.createElement(Button, {
        variant: blocked ? 'secondary' : 'primary',
        size: "sm",
        disabled: blocked,
        onClick: onBook,
        as: blocked ? 'button' : 'a',
        href: blocked ? undefined : href
      }, availability === 'cancelled' ? 'Event cancelled' : availability === 'soldout' ? 'Join waiting list' : free ? 'Reserve a place' : 'Book tickets'))));
    }
    NS.EventCard = EventCard;
  })();

  /* ---- components/cards/ItemCard.jsx ---- */
  (function () {
    var Card = NS.Card, Media = NS.Media;
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
      return /*#__PURE__*/React.createElement(Card, {
        interactive: true,
        as: "a",
        href: href,
        padding: 0,
        style: style,
        ...rest
      }, /*#__PURE__*/React.createElement(Media, {
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
    NS.ItemCard = ItemCard;
  })();

  /* ---- components/cards/RecommendationCard.jsx ---- */
  (function () {
    var Card = NS.Card, Media = NS.Media, Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement(Card, {
        interactive: true,
        as: "a",
        href: href,
        padding: 0,
        style: {
          display: 'grid',
          gridTemplateColumns: '104px minmax(0,1fr)',
          alignItems: 'stretch',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          minWidth: 0,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement(Media, {
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
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 14
      }), reason)));
    }
    NS.RecommendationCard = RecommendationCard;
  })();

  /* ---- components/cards/StatCard.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gap: 'var(--space-2)',
          padding: 'var(--space-5)',
          background: 'var(--surface-card)',
          border: 'var(--border-width) solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement("div", {
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
      }, /*#__PURE__*/React.createElement(Icon, {
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
      }, /*#__PURE__*/React.createElement(Icon, {
        name: deltaTone === 'down' ? 'trending-down' : 'trending-up',
        size: 14
      }), delta), footnote && /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, footnote)));
    }
    NS.StatCard = StatCard;
  })();

  /* ---- components/data/DataTable.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement("div", {
        style: {
          overflowX: 'auto',
          background: 'var(--surface-card)',
          border: 'var(--border-width) solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement("table", {
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
        }, c.header, /*#__PURE__*/React.createElement(Icon, {
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
    NS.DataTable = DataTable;
  })();

  /* ---- components/data/FilterPanel.jsx ---- */
  (function () {
    var Icon = NS.Icon, Checkbox = NS.Checkbox, Select = NS.Select;
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
      }, title), /*#__PURE__*/React.createElement(Icon, {
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
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gap: 'var(--space-4)',
          alignContent: 'start',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement("div", {
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
      }, /*#__PURE__*/React.createElement(Icon, {
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
      }, "Sort by"), /*#__PURE__*/React.createElement(Select, {
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
        return /*#__PURE__*/React.createElement(Checkbox, {
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
    NS.FilterPanel = FilterPanel;
  })();

  /* ---- components/navigation/Tabs.jsx ---- */
  (function () {
    function Tabs({
      items = [],
      value,
      onChange,
      variant = 'underline',
      style,
      ...rest
    }) {
      return /*#__PURE__*/React.createElement("div", {
        role: "tablist",
        style: {
          display: 'flex',
          gap: variant === 'pill' ? 'var(--space-2)' : 'var(--space-6)',
          borderBottom: variant === 'underline' ? 'var(--border-width) solid var(--border-subtle)' : 'none',
          overflowX: 'auto',
          ...style
        },
        ...rest
      }, items.map(it => {
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
    NS.Tabs = Tabs;
  })();

  /* ---- components/navigation/Breadcrumbs.jsx ---- */
  (function () {
    var Icon = NS.Icon;
    function Breadcrumbs({
      items = [],
      style,
      ...rest
    }) {
      return /*#__PURE__*/React.createElement("nav", {
        "aria-label": "Breadcrumb",
        style: style,
        ...rest
      }, /*#__PURE__*/React.createElement("ol", {
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
        }, label), !last && /*#__PURE__*/React.createElement(Icon, {
          name: "chevron-right",
          size: 14,
          color: "var(--neutral-400)"
        }));
      })));
    }
    NS.Breadcrumbs = Breadcrumbs;
  })();

  /* ---- components/navigation/Pagination.jsx ---- */
  (function () {
    var Icon = NS.Icon;
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
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            justifyItems: 'center',
            gap: 'var(--space-3)',
            ...style
          },
          ...rest
        }, resultLabel && /*#__PURE__*/React.createElement("span", {
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
      return /*#__PURE__*/React.createElement("nav", {
        "aria-label": "Pagination",
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          ...style
        },
        ...rest
      }, cell(/*#__PURE__*/React.createElement(Icon, {
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
      }, "…"), cell(n, n, {
        current: n === page,
        onClick: () => onChange && onChange(n)
      }))), cell(/*#__PURE__*/React.createElement(Icon, {
        name: "chevron-right",
        size: 18
      }), 'next', {
        disabled: page === pages,
        onClick: () => onChange && onChange(page + 1)
      }));
    }
    NS.Pagination = Pagination;
  })();

  /* ---- components/navigation/SiteHeader.jsx ---- */
  (function () {
    var Logo = NS.Logo, Icon = NS.Icon, Button = NS.Button, IconButton = NS.IconButton;
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
      return /*#__PURE__*/React.createElement("header", {
        style: {
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--surface-card)',
          borderBottom: 'var(--border-width) solid var(--border-subtle)',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          height: m === 'mobile' ? 'var(--header-h-mobile)' : 'var(--header-h-desktop)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: `0 ${m === 'mobile' ? 'var(--container-pad-mobile)' : m === 'tablet' ? 'var(--container-pad-tablet)' : 'var(--container-pad-desktop)'}`
        }
      }, m === 'mobile' && /*#__PURE__*/React.createElement(IconButton, {
        icon: "menu",
        label: "Open menu",
        onClick: onMenu
      }), /*#__PURE__*/React.createElement(Logo, {
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
      }, /*#__PURE__*/React.createElement(IconButton, {
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
      }, isMember ? 'Member' : 'Account')), m !== 'mobile' && /*#__PURE__*/React.createElement(Icon, {
        name: "chevron-down",
        size: 16,
        color: "var(--text-muted)"
      })) : m === 'mobile' ? /*#__PURE__*/React.createElement(IconButton, {
        icon: "user",
        label: "Sign in",
        onClick: onSignIn
      }) : /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: onSignIn
      }, "Sign in"), m === 'desktop' && /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        iconLeft: "ticket",
        onClick: () => onNavigate && onNavigate('Tickets')
      }, "Book tickets"))));
    }
    NS.SiteHeader = SiteHeader;
  })();

  /* ---- components/navigation/SiteFooter.jsx ---- */
  (function () {
    var Logo = NS.Logo, Icon = NS.Icon;
    const COLUMNS = [{
      title: 'Visit',
      links: ['Plan your visit', 'Opening hours', 'Getting here', 'Accessibility', 'Families']
    }, {
      title: 'Explore',
      links: ['Collections', 'What’s on', 'Membership', 'Learning', 'Support us']
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
      return /*#__PURE__*/React.createElement("footer", {
        style: {
          background: 'var(--surface-inverse)',
          color: 'var(--paper-100)',
          ...style
        },
        ...rest
      }, /*#__PURE__*/React.createElement("div", {
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
      }, /*#__PURE__*/React.createElement(Logo, {
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
      }, /*#__PURE__*/React.createElement(Icon, {
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
      }, "Mon–Fri 10:00–17:30", /*#__PURE__*/React.createElement("br", null), "Sat–Sun 09:30–18:00", /*#__PURE__*/React.createElement("br", null), "Last entry 45 minutes before close"), /*#__PURE__*/React.createElement("p", {
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
      }, /*#__PURE__*/React.createElement("span", null, "© 2026 Heritage Museum"), /*#__PURE__*/React.createElement("div", {
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
    NS.SiteFooter = SiteFooter;
  })();

  /* ---- components/navigation/StaffSidebar.jsx ---- */
  (function () {
    var Logo = NS.Logo, Icon = NS.Icon;
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
      return /*#__PURE__*/React.createElement("aside", {
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
        },
        ...rest
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: '0 var(--space-2)'
        }
      }, /*#__PURE__*/React.createElement(Logo, {
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
        }, /*#__PURE__*/React.createElement(Icon, {
          name: it.icon,
          size: 18
        }), !collapsed && it.label);
      }))));
    }
    NS.StaffSidebar = StaffSidebar;
  })();

  /* ---- components/navigation/StaffTopBar.jsx ---- */
  (function () {
    var Icon = NS.Icon, IconButton = NS.IconButton, SearchField = NS.SearchField;
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
      return /*#__PURE__*/React.createElement("header", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--surface-card)',
          borderBottom: 'var(--border-width) solid var(--border-subtle)',
          ...style
        },
        ...rest
      }, showMenu && /*#__PURE__*/React.createElement(IconButton, {
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
      }, subtitle)), showSearch && /*#__PURE__*/React.createElement(SearchField, {
        size: "sm",
        placeholder: "Search the portal",
        style: {
          width: 240
        },
        id: "staff-search"
      }), actions, /*#__PURE__*/React.createElement(IconButton, {
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
      }, user.role)), /*#__PURE__*/React.createElement(Icon, {
        name: "chevron-down",
        size: 16,
        color: "var(--text-muted)"
      })));
    }
    NS.StaffTopBar = StaffTopBar;
  })();

})();
