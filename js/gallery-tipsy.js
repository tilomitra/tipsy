

var getCN = Y.ClassNameManager.getClassName,

//HTML5 Data Attributes
DATA_CONTENT = 'data-content',
DATA_PLACEMENT = 'data-placement',

//Classes
TIPSY = 'tipsy',
FADE = 'fade',
IN = 'in',

CLASSES = {
    fade: getCN(TIPSY, FADE),
    fadeIn: getCN(TIPSY, IN)
};


Y.Tipsy = Y.Base.create("tipsy", Y.Widget, [Y.WidgetPointer, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetStack], {

    _handles    : [],

    //constructor
    initializer : function(config) {
        
    },

    //clean up on destruction
    destructor : function() {
        Y.each(this._handles, function(v, k, o) {
            v.detach();
        });
    },

    renderUI : function () {
        this.get('boundingBox').addClass(CLASSES.fade);
    },

    bindUI : function () {
        var del = this.get('delegate'),
            selector = this.get('selector');

        this._handles.push(del.delegate(['mouseover', 'touchstart'], this._handleDelegateStart, selector, this));
    },

    _handleDelegateStart : function (e) {
        var del = this.get('delegate'),
            selector = this.get('selector'),
            node = e.currentTarget;

        this._handles.push(del.delegate(['mouseout', 'touchend'], this._handleDelegateEnd, selector, this));

        this.showTooltip(node);
    },

    _handleDelegateEnd: function (e) {
        this.hideTooltip();
    },

    showTooltip : function (node) {
        this._setTooltipContent(node);
        this._alignTooltip(node);
        this.alignPointer(node);
        this.get('boundingBox').addClass(CLASSES.fadeIn);
    },
    
    hideTooltip : function () {
        this.get('boundingBox').removeClass(CLASSES.fadeIn);
    },
    
    _setTooltipContent: function (node) {
        var content = node.getAttribute(DATA_CONTENT) || this.get('content'),
            contentBox = this.get('contentBox');

        contentBox.setContent(content);
    },
    
    _alignTooltip : function (node) {
        var placement = node.getAttribute(DATA_PLACEMENT) || this.get('placement');

        switch (placement) {
            case "above":
                this.align(node, ["bc", "tc"]);
                break;
            case "left":
                this.align(node, ["rc", "lc"]);
                break;
            case "below":
                this.align(node, ["tc", "bc"]);
                break;
            case "right":
                this.align(node, ["lc", "rc"]);
                break;
            default:
                break;
        }            
    }
},
{
    NS : "tipsy",

    ATTRS : {
        content : { 
            value : ''
        },

        selector: {
            value: null
        },

        zIndex: {
            value: 2
        },
        
        delegate: {
            value: null,
            setter: function(val) {
                return Y.one(val) || Y.one("document");
            }
        }
    }
});
