
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LayoutGrid = require('./layoutgrid').Grid;
//var LayoutGridProtoType = require('./layoutgrid').prototype;


var LayoutGroupView = function(params) {
    LayoutGrid.extendTo(this);

    this._colapsed = _.isUndefined(params.colapsed) ? false : params.colapsed;
    if (this._colapsed)
        this.$el.addClass("silky-gridlayout-colapsed");

    this.rowTransform = function(row, column) {
        if ( ! this.ignoreTransform) {
            if (this.style === 'inline')
                return row;
            else
                return row + 1;
        }

        return row;
    };

    this.columnTransform = function(row, column) {
        if ( ! this.ignoreTransform)
            return column + 1;

        return column;
    };

    this.setInfo = function(style, level) {
        this.style = style;
        this.level = level;
    };

    this.addHeader = function($header) {
        this.ignoreTransform = true;
        var fitToGrid = this.style === 'inline';
        this.headerCell = this.addCell(0, 0, fitToGrid, $header);
        this.headerCell.setVisibility(true);
        this.headerCell.$el.addClass("silky-group-header");
        if (this.style === 'list')
            this.addSpacer(0, 1, true, 10, 5);
        this.ignoreTransform = false;
        return this.headerCell;
    };

    this.colapse = function() {

        if (this._colapsed)
            return;

        this.$el.addClass("silky-gridlayout-colapsed");

        this.setContentVisibility(false);
        this.invalidateLayout('both', Math.random());
        this._colapsed = true;
    };

    this.setContentVisibility = function(visible) {
        for (var i = 0; i < this._cells.length; i++) {
            var cell = this._cells[i];
            if (this.headerCell._id !== cell._id)
                cell.setVisibility(visible);
        }
    };

    this.expand = function() {

        if ( ! this._colapsed)
            return;

        this.$el.removeClass("silky-gridlayout-colapsed");

        this.setContentVisibility(true);
        this.invalidateLayout('both', Math.random());
        this._colapsed = false;

    };

    this.toggleColapsedState = function() {
        if (this._colapsed)
            this.expand();
        else
            this.colapse();
    };

    this.onCellAdded = function(cell) {
        if (_.isUndefined(this.headerCell) === false && this.headerCell._id !== cell._id)
            cell.setVisibility(this._colapsed === false);
    };
};

module.exports = LayoutGroupView;
