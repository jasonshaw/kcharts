define('kg/kcharts/5.0.1/barchart/index',["util","node","base","event-dom","kg/kcharts/5.0.1/tools/template/index","kg/kcharts/5.0.1/raphael/index","kg/kcharts/5.0.1/basechart/index","kg/kcharts/5.0.1/tools/color/index","kg/kcharts/5.0.1/tools/htmlpaper/index","kg/kcharts/5.0.1/legend/index","./theme","kg/kcharts/5.0.1/tools/touch/index","kg/kcharts/5.0.1/tip/index","kg/kcharts/5.0.1/animate/index","kg/kcharts/5.0.1/tools/graphtool/index","./cfg"],function(require, exports, module) {


	var Util = require("util"),
		Node = require("node"),
		Base = require("base"),
		Evt = require('event-dom'),
		Template = require("kg/kcharts/5.0.1/tools/template/index"),
		Raphael = require("kg/kcharts/5.0.1/raphael/index"),
		BaseChart = require("kg/kcharts/5.0.1/basechart/index"),
		ColorLib = require("kg/kcharts/5.0.1/tools/color/index"),
		HtmlPaper = require("kg/kcharts/5.0.1/tools/htmlpaper/index"),
		Legend = require("kg/kcharts/5.0.1/legend/index"),
		Theme = require("./theme"),
		Touch = require("kg/kcharts/5.0.1/tools/touch/index"),
		Tip = require("kg/kcharts/5.0.1/tip/index"),
		Anim = require("kg/kcharts/5.0.1/animate/index"),
		graphTool = require("kg/kcharts/5.0.1/tools/graphtool/index"),
		Cfg = require("./cfg");

	var $ = Node.all,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		canvasCls = themeCls + "-canvas",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls + "-areas",
		evtLayoutBarsCls = evtLayoutCls + "-bars",
		COLOR_TPL = /\{COLOR\}/g,
		color;
	var methods = {
		initializer: function() {
			this.init();
		},
		init: function() {
			var self = this;
			self.chartType = "barchart";
			var defaultCfg = Util.clone(Cfg);
			
			self._cfg = Util.mix(defaultCfg, self.userConfig, undefined, undefined, true)
			BaseChart.prototype.init.call(self, self._cfg);
			self._cfg.autoRender && self.render();
		},
		render: function(clear) {
			var self = this,
				_cfg = self._cfg,
				ctn = self._innerContainer,
				themeCls = _cfg.themeCls;
			if (!self._$ctnNode[0]) return;

			BaseChart.prototype.dataFormat.call(self, self._cfg);

			self._$ctnNode.html("");
			
			self._bars = {};
			
			self._finished = [];
			
			themeCls = self._cfg.themeCls || Cfg.themeCls;
			self._cfg = Util.mix(Util.clone(Util.mix(Cfg, Theme[themeCls], undefined, undefined, true)), self._cfg, undefined, undefined, true);
			self.color = color = new ColorLib({
				themeCls: themeCls
			});
			if (self._cfg.colors.length > 0) {
				color.removeAllColors();
			}
			for (var i in self._cfg.colors) {
				color.setColor(self._cfg.colors[i]);
			}
			self.raphaelPaper = Raphael(self._$ctnNode[0], _cfg.width, _cfg.height);
			
			self.paper = new HtmlPaper(self._$ctnNode, {
				clsName: canvasCls,
				width: ctn.width,
				height: ctn.height,
				left: ctn.tl.x,
				top: ctn.tl.y
			});
			
			self._clonePoints = self._points;

			self.getBarsPos();
			
			self.htmlPaper = new HtmlPaper(self._$ctnNode, {
				clsName: themeCls
			});

			BaseChart.Common.drawTitle.call(null, this, themeCls);

			BaseChart.Common.drawSubTitle.call(null, this, themeCls);
			
			self.renderEvtLayout();
			
			self.renderTip();
			
			BaseChart.Common.drawGridsX.call(null, this);

			BaseChart.Common.drawGridsY.call(null, this);
			
			BaseChart.Common.drawAxisX.call(null, this);

			BaseChart.Common.drawAxisY.call(null, this);
			
			BaseChart.Common.drawLabelsX.call(null, this);

			BaseChart.Common.drawLabelsY.call(null, this);

			self.renderLegend();
			
			self.drawBars(function() {

				self.afterRender();

				self.fix2Resize();
			});

			self.bindEvt();

		},
		
		drawBar: function(groupIndex, barIndex, callback) {
			var self = this,
				_cfg = self._cfg,
				paper = self.getRaphaelPaper(),
				ctn = self._innerContainer,
				color = self.color.getColor(groupIndex)['DEFAULT'],
				attr = self.processAttr(_cfg.bars.attr, color),
				isY = _cfg.zoomType == "x" ? false : true,
				barPos = self._barsPos[groupIndex][barIndex],
				x = Math.round(barPos.x - 0),
				y = Math.round(barPos.y - 0),
				w = Math.round(barPos.width - 0),
				h = Math.round(barPos.height - 0),
				rect;

			
			if (h >= 0 && h <= 1) {
				h = 1;
				
			}
			
			if (_cfg.anim) {
				var duration = _cfg.anim.duration ? (Util.isNumber(_cfg.anim.duration) ? _cfg.anim.duration : 500) : 500,
					easing = _cfg.anim.easing ? _cfg.anim.easing : "easeOut";
				if (isY) {
					var zeroX = BaseChart.prototype.data2GrapicData.call(self, 0, true, false);
					rect = paper.rect(zeroX, y, 0, h).attr(attr).animate({
						"width": w,
						"x": x
					}, duration, easing, function() {
						callback && callback();
					});
				} else {
					var zeroY = BaseChart.prototype.data2GrapicData.call(self, 0, false, true);
					rect = paper.rect(x, zeroY, w, 0).attr(attr).animate({
						"height": h,
						"y": y
					}, duration, easing, function() {
						callback && callback();
					});
				}
			} else {
				rect = paper.rect(x, y, w, h).attr(attr);
				callback && callback();
			}
			return rect;
		},
		
		getBarsPos: function() {
			var self = this,
				zoomType = self._cfg.zoomType,
				stackable = self._cfg.stackable,
				isY = zoomType == "y",
				ctn = self.getInnerContainer(),
				len = stackable ? 1 : BaseChart.prototype.obj2Array(self._clonePoints).length, 
				barsRatio = self._cfg.bars.barsRatio, 
				barRatio = self._cfg.bars.barRatio, 
				areaWidth = isY ? (self._pointsY.length > 1 ? (self._pointsY[1].y - self._pointsY[0].y) : ctn.height) : (self._pointsX.length > 1 ? (self._pointsX[1].x - self._pointsX[0].x) : ctn.width), 
				offsetWidth = areaWidth * barsRatio, 
				rate = barRatio >= 1 ? 0 : (1 - barRatio) / barRatio,
				barWidth = offsetWidth / (len + (len - 1) * rate), 
				spaceWidth = barWidth * (1 - barRatio) / barRatio, 
				barAndSpaceWidth = stackable ? 0 : barWidth + spaceWidth,
				ctnY = self._innerContainer.bl.y,
				ctnX = self._innerContainer.bl.x,
				offset = (areaWidth * (1 - barsRatio) - areaWidth) / 2,
				stackArray = []; 

			self._barsPos = {};

			for (var i in self._points) {
				var tmpArray = [];
				
				if (isY) {
					var zeroX = BaseChart.prototype.data2GrapicData.call(self, 0, true, false);
					for (var j in self._points[i]) {
						var barPosInfo = {},
							x = self._points[i][j].x,
							w = Math.abs(x - zeroX);
						barPosInfo.y = offset + self._points[i][j].y;
						
						if (stackable) {
							barPosInfo.x = ctnX + (stackArray[j] || 0);
							stackArray[j] = stackArray[j] ? stackArray[j] + w : w;
						} else {
							barPosInfo.x = x > zeroX ? x - w : zeroX - w;
						}
						barPosInfo.width = w;
						barPosInfo.height = barWidth;
						tmpArray.push(barPosInfo);
					}
				} else {
					var zeroY = BaseChart.prototype.data2GrapicData.call(self, 0, false, true);
					for (var j in self._points[i]) {
						var barPosInfo = {},
							y = self._points[i][j].y,
							h = Math.abs(zeroY - y);
						barPosInfo.x = offset + self._points[i][j].x;
						
						if (stackable) {
							barPosInfo.y = y - (stackArray[j] || 0);
							stackArray[j] = stackArray[j] ? stackArray[j] + h : h;
						} else {
							barPosInfo.y = y > zeroY ? zeroY : y;
						}
						barPosInfo.width = barWidth;
						barPosInfo.height = h;
						tmpArray.push(barPosInfo);
					}
				}
				offset += barAndSpaceWidth;
				for (var j in tmpArray) {
					for (k in tmpArray[j]) {
						
						tmpArray[j][k] = Math.ceil(tmpArray[j][k]);
					}
				}

				self._barsPos[i] = tmpArray;
			}
		},
		
		drawBars: function(callback) {
			var self = this,
				_cfg = self._cfg;

			for (var i in self._barsPos) {
				var bars = [],
					posInfos = [];

				for (var j in self._barsPos[i]) {
					var barPos = self._barsPos[i][j];
					posInfos[j] = barPos;
					bars[j] = self.drawBar(i, j, function() {
						self._finished.push(true);
						if (callback && self._finished.length == self._cfg.series.length) {
							callback();
						}
					}).attr({
						"barGroup": i,
						"barIndex": j,
						"defaultColor": color.getColor(i).DEFAULT,
						"hoverColor": color.getColor(i).HOVER
					});
				}
				var barObj = {
					bars: bars,
					posInfos: posInfos,
					color: color.getColor(i),
					isShow: true
				};
				self._bars[i] = barObj;
			}
			return self._bars;
		},
		
		renderTip: function() {
			if (!this._cfg.tip.isShow) return;
			var self = this,
				_cfg = self._cfg,
				ctn = self._innerContainer,
				boundryCfg = _cfg.tip.boundryDetect ? {
					x: ctn.tl.x,
					y: ctn.tl.y,
					width: ctn.width,
					height: ctn.height
				} : {},
				tipCfg = Util.mix(_cfg.tip, {
					rootNode: self._$ctnNode,
					clsName: _cfg.themeCls,
					boundry: boundryCfg
				});

			self.tip = new Tip(tipCfg);
			return self.tip;
		},
		
		renderEvtLayout: function() {
			var self = this,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				h = ctn.height,
				multiple = self._multiple,
				evtBars = self._evtEls._bars = [],
				paper,
				x;

			if (!self._evtEls.paper) {
				paper = self._evtEls.paper = new HtmlPaper(self._$ctnNode, {
					clsName: evtLayoutCls,
					prependTo: false, 
					width: ctn.width,
					height: h,
					left: ctn.tl.x,
					top: ctn.tl.y,
					css: {
						"z-index": 20,
						background: "#fff",
						filter: "alpha(opacity =1)",
						"-moz-opacity": 0.01,
						"-khtml-opacity": 0.01,
						opacity: 0.01
					}
				});
			} else {
				paper = self._evtEls.paper;
			}
			self._evtEls._bars = self._barsPos;
			return paper;
		},
		
		delegateMouseMove: function(e) {
			var self = this,
				ctn = self.getInnerContainer(),
				curBarIndex = self.curBarIndex;
			for (var i in self._evtEls._bars) {
				for (var j in self._evtEls._bars[i]) {
					var bar = self._evtEls._bars[i][j];
					if (self.isInSide(e.offsetX + ctn.x, e.offsetY + ctn.y, bar['x'], bar['y'], bar['width'], bar['height'])) {
						if (self.curBarIndex === j && self.curGroupIndex === i) return;
						self.curBarIndex = j;
						self.curGroupIndex = i;
						self.tipHandler(self.curGroupIndex, self.curBarIndex);
						return;
					}
				}
			}
		},
		clearEvtLayout: function() {
			var self = this;
			if (self._evtEls._bars && self._evtEls._bars.length) {
				self._evtEls._bars = [];
			}
		},
		renderLegend: function() {
			if (!this._cfg.legend.isShow) return;
			var self = this,
				legendCfg = self._cfg.legend,
				container = (legendCfg.container && $(legendCfg.container)[0]) ? $(legendCfg.container) : self._$ctnNode;

			var innerContainer = self._innerContainer;
			var colors = self.color._colors, 
				len = colors.length,
				cfg = self._cfg,
				series = self._cfg.series
			var __legendCfg = Util.map(series, function(serie, i) {
				i = i % len;
				var item = {},
					color = colors[i]
				item.text = serie.text;
				item.DEFAULT = color.DEFAULT;
				item.HOVER = color.HOVER;
				return item;
			});
			var globalConfig = Util.merge({
				
				
				interval: 20, 
				iconright: 5, 
				showicon: true 
			}, cfg.legend.globalConfig);

			self.legend = new Legend({
				container: container,
				bbox: {
					width: innerContainer.width,
					height: innerContainer.height,
					left: innerContainer.x,
					top: innerContainer.y
				},
				align: cfg.legend.align || "bc",
				offset: cfg.legend.offset || (/t/g.test(cfg.legend.align) ? [0, 0] : [0, 20]),
				globalConfig: globalConfig,
				config: __legendCfg
			});

			self.legend.on("click", function(evt) {
				var i = evt.index,
					$text = evt.text,
					$icon = evt.icon,
					el = evt.el
				if (el.hide != 1) {
					this.hideBar(i);
					el.hide = 1;
					el.disable();
				} else {
					this.showBar(i);
					el.hide = 0;
					el.enable();
				}
			}, this);
			return self.legend;
		},
		bindEvt: function() {
			var self = this,
				_cfg = self._cfg,
				evtEls = self._evtEls;
			self.curGroupIndex = self.getFirstVisibleBarGroupIndex();
			self.curBarIndex = self.getFirstNotEmptyBarIndex(self.curGroupIndex);
			Evt.detach(evtEls.paper.$paper, "mousemove");
			
			Evt.on(evtEls.paper.$paper, "mousemove", function(e) {
				
				e = self.getOffset(e);
				
				self.delegateMouseMove(e);
			});

			Evt.detach(self._evtEls.paper.$paper, "mouseleave");

			Evt.on(self._evtEls.paper.$paper, "mouseleave", function(e) {
				self.tip && self.tip.hide();
				self.paperLeave();
				self.curBarIndex = undefined;
			})
		},
		
		isEmptyPoint: function(point) {
			if (point && point['dataInfo']) {
				return false;
			} else {
				return true;
			}
		},
		paperLeave: function() {
			var self = this;
			self.fire("paperLeave", self);
		},
		barChange: function(barGroup, barIndex) {
			var self = this,
				currentBars = self._bars[barGroup],
				e = Util.mix({
					target: currentBars['bars'][barIndex],
					currentTarget: currentBars['bars'][barIndex],
					barGroup: Math.round(barGroup),
					barIndex: Math.round(barIndex)
				}, self._points[barGroup][barIndex]);

			self.curBarIndex = barIndex;
			self.curGroupIndex = barGroup;

			self.fire("barChange", e);
		},
		delegateClick: function(e) {
			var self = this,
				ctn = self.getInnerContainer();
			for (var i in self._evtEls._bars) {
				for (var j in self._evtEls._bars[i]) {
					var rect = self._evtEls._bars[i][j];
					if (self.isInSide(e.offsetX + ctn.x, e.offsetY + ctn.y, rect['x'], rect['y'], rect['width'], rect['height'])) {
						self.barClick(i, j);
						return;
					}
				}
			}
		},
		barClick: function(barGroup, barIndex) {
			var self = this,
				currentBars = self._bars[barGroup],
				e = Util.mix({
					target: currentBars['bars'][barIndex],
					currentTarget: currentBars['bars'][barIndex],
					barGroup: Math.round(barGroup),
					barIndex: Math.round(barIndex)
				}, self._points[barGroup][barIndex]);
			self.fire("barClick", e);
		},
		tipHandler: function(barGroup, barIndex) {
			var self = this,
				_cfg = self._cfg,
				tip = self.tip,
				isY = _cfg.zoomType == "y" ? true : false,
				$bar = self._bars[barGroup]['bars'][barIndex],
				defaultColor = $bar.attr("defaultColor"),
				tpl = self._cfg.tip.template,
				posx = isY ? $bar.attr("x") / 1 + $bar.attr("width") / 1 : $bar.attr("x"),
				posy = $bar.attr("y"),
				tipData = Util.merge(self._points[barGroup][barIndex].dataInfo, _cfg.series[barGroup]);
			
			delete tipData.data;
			self._points[barGroup][barIndex]["dataInfo"],
			self.barChange(barGroup, barIndex);
			if (!tpl) return;
			Util.mix(tipData, {
				groupindex: barGroup,
				barindex: barIndex
			});
			tip && tip.fire("setcontent", {
				data: tipData
			})
			tip && tip.fire("move", {
				x: posx,
				y: posy,
				style: self.processAttr(_cfg.tip.css, defaultColor)
			});
		},
		processAttr: function(attrs, color) {
			var newAttrs = Util.clone(attrs);
			for (var i in newAttrs) {
				if (newAttrs[i] && typeof newAttrs[i] == "string") {
					newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
				}
			}
			return newAttrs;
		},
		getFirstVisibleBarGroupIndex: function() {
			var self = this;
			for (var i in self._bars) {
				if (self._bars[i]['isShow']) {
					return i;
				}
			}
		},
		getFirstNotEmptyBarIndex: function(barIndex) {
			var self = this;
			for (var i in self._points) {
				if (!self.isEmptyPoint(self._points[i][barIndex]) && self._bars[i]['isShow']) {
					return i + "";
				}
			}
			return "";
		},
		fix2Resize: function() {
			var self = this,
				$ctnNode = self._$ctnNode;
			self._cfg.anim = "";
			var rerender = Util.buffer(function() {
				self.render();
			}, 200);
			!self.__isFix2Resize && self.on("resize", function() {
				self.__isFix2Resize = 1;
				rerender();
			})
		},
		showBar: function(barIndex) {
			var self = this,
				ctn = self._innerContainer;
			self._bars[barIndex]['isShow'] = true;
			BaseChart.prototype.recoveryData.call(self, barIndex);
			self._clonePoints[barIndex] = self._points[barIndex];
			BaseChart.Common.animateGridsAndLabels.call(null, self);
			self.getBarsPos();
			
			for (var i in self._bars)
				if (i != barIndex) {
					for (var j in self._bars[i]['bars']) {
						if (self._barsPos[i]) {
							var barPos = self._barsPos[i][j];
							barPos && self._bars[i]['bars'][j].stop().animate({
								"height": barPos.height,
								"width": barPos.width,
								"y": barPos.y,
								"x": barPos.x
							}, 400, "easeOut", function() {});
							self._bars[i]['bars'][j].attr({
								"posx": barPos.x,
								"posy": barPos.y
							});
						}
					}
				}
			var posInfos = [],
				bars = [];
			for (var j in self._barsPos[barIndex]) {
				var barPos = self._barsPos[barIndex][j];
				posInfos[j] = barPos;
				bars[j] = self.drawBar(barIndex, j).attr({
					"barGroup": barIndex,
					"barIndex": j,
					"defaultColor": color.getColor(barIndex).DEFAULT,
					"hoverColor": color.getColor(barIndex).HOVER
				});
			}
			self._bars[barIndex] = {
				bars: bars,
				posInfos: posInfos,
				color: color.getColor(i)
			};
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		hideBar: function(barIndex) {
			var self = this,
				ctn = self._innerContainer;
			self._bars[barIndex]['isShow'] = false;
			BaseChart.prototype.removeData.call(self, barIndex);
			delete self._clonePoints[barIndex];
			BaseChart.Common.animateGridsAndLabels.call(null, self);
			self.getBarsPos();
			for (var i in self._bars[barIndex]['bars']) {
				self._bars[barIndex]['bars'][i].remove();
			}
			
			for (var i in self._bars)
				if (i != barIndex) {
					for (var j in self._bars[i]['bars']) {
						var barPos = self._barsPos[i] ? self._barsPos[i][j] : "";
						barPos && self._bars[i]['bars'][j].stop().animate({
							"height": barPos.height,
							"width": barPos.width,
							"y": barPos.y,
							"x": barPos.x
						}, 400, "easeOut", function() {

						});
						self._bars[i]['bars'][j].attr({
							"posx": barPos.x,
							"posy": barPos.y
						});
					}
				}
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		afterRender: function() {
			var self = this;
			self.fire("afterRender", self);
		},
		
		getHtmlPaper: function() {
			return this.paper;
		},
		
		getRaphaelPaper: function() {
			return this.raphaelPaper;
		},
		
		clear: function() {
			this._$ctnNode.html("");
		}
	};

	return BaseChart.extend(methods);

});