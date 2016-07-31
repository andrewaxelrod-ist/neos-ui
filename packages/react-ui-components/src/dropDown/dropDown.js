import React, {Component, PropTypes} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import {makeFocusNode} from './../_lib/focusNode';

export class DropDown extends Component {
    static propTypes = {
        className: PropTypes.string,
        isOpen: PropTypes.bool.isRequired,
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'dropDown': PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        isOpen: false
    };

    static childContextTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {isOpen: props.isOpen};
        this.handleToggle = this.toggle.bind(this);
        this.handleClose = this.close.bind(this);
        this.handleClickOutside = this.close.bind(this);
    }

    getChildContext() {
        return {
            isOpen: this.state.isOpen,
            toggleDropDown: this.handleToggle,
            closeDropDown: this.handleClose
        };
    }

    render() {
        const {children, className, theme, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen']);
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.dropDown]: true
        });

        return (
            <div {...rest} className={finalClassName}>
                {children}
            </div>
        );
    }

    close() {
        this.setState({isOpen: false});
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export class Header extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'dropDown__btn': PropTypes.string,
            'dropDown__btnLabel': PropTypes.string,
            'dropDown__chevron': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    };

    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {isOpen, toggleDropDown} = this.context;
        const {className, children, theme, ...restProps} = this.props;
        const rest = omit(restProps, ['IconComponent']);
        const finalClassName = mergeClassNames({
            [theme.dropDown__btn]: true,
            [className]: className && className.length
        });

        return (
            <button
                {...rest}
                onClick={toggleDropDown}
                ref={makeFocusNode(isOpen)}
                className={finalClassName}
                aria-haspopup="true"
                >
                {children}
                {this.renderChevronIcon()}
            </button>
        );
    }

    renderChevronIcon() {
        const {isOpen} = this.context;
        const {IconComponent, theme} = this.props;
        const iconName = isOpen ? 'chevron-up' : 'chevron-down';

        return <IconComponent icon={iconName} className={theme.dropDown__chevron}/>;
    }
}

export class Contents extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'dropDown__contents': PropTypes.string,
            'dropDown__contents--isOpen': PropTypes.string
        }).isRequired
    };

    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {className, children, theme, ...rest} = this.props;
        const {isOpen, closeDropDown} = this.context;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.dropDown__contents]: true,
            [theme['dropDown__contents--isOpen']]: isOpen
        });

        return (
            <ul
                {...rest}
                className={finalClassName}
                aria-hidden={isOpen ? 'false' : 'true'}
                aria-label="dropdown"
                onClick={() => closeDropDown()}
                role="button"
                >
                {children}
            </ul>
        );
    }
}

//
// Add the click-outside functionality to the DropDown component.
//
const EnhancedDropDown = enhanceWithClickOutside(DropDown);

export default EnhancedDropDown;
