// ==UserScript==
// @name		AMD Stock Chart Widget
// @namespace	https://github.com/dijky/userscripts/reddit.com
// @author		Dijky
// @description	Add a stock chart widget to the sidebar of AMD subreddits. Widget powered by TradingView.com
// @downloadURL	https://github.com/Dijky/userscripts/raw/master/reddit.com/amd_stock_chart_widget.user.js
// @supportURL	https://github.com/Dijky/userscripts/issues
// @require		https://raw.githubusercontent.com/Dijky/MonkeyConfig/master/monkeyconfig.js
// @require		https://s3.amazonaws.com/tradingview/tv.js
// @include		/^https?://\w+\.reddit\.com/r/Amd/.*$/
// @include		/^https?://\w+\.reddit\.com/r/AyyMD/.*$/
// @include		/^https?://\w+\.reddit\.com/r/AMDHelp/.*$/
// @include		/^https?://\w+\.reddit\.com/r/AMD_Stock/.*$/
// @include		/^https?://\w+\.reddit\.com/r/radeon/.*$/
// @include		/^https?://\w+\.reddit\.com/r/AdvancedMicroDevices/.*$/
// @version		6.2
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_addStyle
// @grant		GM_getMetadata
// @grant		GM_registerMenuCommand
// ==/UserScript==

(function(document, window){
	var chartNode;
	var targetNode;
	var chartWidget;
	var configuration;
	
	function buildWidget()
	{
		chartNode = document.createElement("div");
		chartNode.id = "dijky-stock-chart-widget";
		chartNode.classList.add("spacer");
		chartNode.style.width = "100%";
		
		var index = configuration.get("widget_index");
		var elms = targetNode.getElementsByClassName("spacer");
		if (index < elms.length)
		{
			targetNode.insertBefore(chartNode, elms[index]);
		}
		else
		{
			targetNode.appendChild(chartNode);
		}
		
		while(chartNode.firstChild)
		{
			chartNode.removeChild(chartNode.firstChild);
		}
		
		var bigmode = configuration.get("mode") == "big";
		var range = configuration.get("range");
		var _symbols = configuration.get("symbols");
		var orange = function(a) {return "rgba(241, 79, 37, " + a + ")"; };
		var symbols = [];
		for (var k = 0; k < _symbols.length; ++k)
		{
			if (_symbols[k].indexOf("//") === 0)
			{
				continue;
			}
			var d = _symbols[k].split("=");
			var s = d[1];
			
			if (s.indexOf("|") === -1)
			{
				s += "|" + range;
			}
			
			symbols.push([d[0], s]);
		}
		var chartWidgetOptions = {
			container_id: "dijky-stock-chart-widget",
			width: "100%",
			height: bigmode ? "500px" : ((210+symbols.length*31) + "px"),
			chartOnly: false,
			symbols: symbols,
			fontColor: orange(1),
			trendLineColor: orange(1),
			underLineColor: orange(0.08),
			activeTickerBackgroundColor: orange(0.4),
			styleTabActiveBorderColor: orange(1),
			styleTickerSymbolColor: "#000000",
			styleTickerChangeUpColor: "",
			// styleTickerChangeDownColor: "#000000",
			styleWidgetNoBorder: true
		};
	
		console.log(">> dijky/reddit.com/amd_stock_chart_widget is building");

		// Create widget
		var widget;
		if (bigmode)
		{
			widget = new TradingView.MediumWidget(chartWidgetOptions);
		}
		else
		{
			widget = new TradingView.MiniWidget(chartWidgetOptions);
		}
		return widget;
	}
	
	function buildConfig()
	{
		var cfg = {
			title: "Dijky's AMD Stock Chart Widget Configuration",
			parameters: {
				"mode": {
					type: "select",
					choices: ["small", "big"],
					variant: "radio",
					"default": "small"
				},
				"widget_index": {
					label: "Widget position index",
					type: "number",
					"default": 4
				},
				"range": {
					label: "Default date range",
					type: "select",
					choices: ["1d", "1m", "3m", "1y", "5y", "max"],
					"default": "1m"
				},
				"symbols": {
					type: "custom",
					html: '<textarea id="dijky-stock-chart-widget-cfg-symbols"></textarea>',
					set: function(value, parent) {
						parent.querySelectorAll("textarea")[0].value = value.join("\n");
					},
					get: function(parent) {
						return parent.querySelectorAll("textarea")[0].value.split("\n");
					},
					"default": [
						"AMD=NASDAQ:AMD",
						"Nvidia=NASDAQ:NVDA",
						"Intel=NASDAQ:INTC",
						"//NASDAQ Comp=NASX", // Disable symbol with "//" prefix
						"//SOXX=NASDAQ:SOXX",
						"//AMD 1y=NASDAQ:AMD|1y" // Override default date range with "|1d", "|1y" etc. suffix						
					]
				}
			},
			onSave: function(values) {
				chartWidget = buildWidget();
			}
		};
		return new MonkeyConfig(cfg);
	}

	function handler()
	{
		configuration = buildConfig();
		GM_registerMenuCommand("AMD Stock Chart Widget Config", function ()
		{
			configuration.open("layer");
		});
		
		targetNode = document.getElementsByClassName("side")[0];
		chartWidget = buildWidget();
	}

	handler();
})(document, window);
