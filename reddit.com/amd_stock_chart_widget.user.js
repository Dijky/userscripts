// ==UserScript==
// @name        AMD Stock Chart Widget
// @namespace   https://github.com/dijky/userscripts/reddit.com
// @author		Dijky
// @description Add a stock chart widget to the sidebar of AMD subreddits. Widget powered by TradingView.com
// @downloadURL	https://github.com/Dijky/userscripts/raw/master/reddit.com/amd_stock_chart_widget.user.js
// @supportURL	https://github.com/Dijky/userscripts/issues
// @include     /^https?://\w+\.reddit\.com/r/Amd/.*$/
// @include     /^https?://\w+\.reddit\.com/r/AyyMD/.*$/
// @include     /^https?://\w+\.reddit\.com/r/AMDHelp/.*$/
// @include     /^https?://\w+\.reddit\.com/r/AMD_Stock/.*$/
// @include     /^https?://\w+\.reddit\.com/r/radeon/.*$/
// @include     /^https?://\w+\.reddit\.com/r/AdvancedMicroDevices/.*$/
// @version     5
// @grant       none
// ==/UserScript==

(function(document, window, options){
	function run(document, window)
	{
		var orange = function(a) {return "rgba(241, 79, 37, " + a + ")"; };
		var symbols = [];
		for (var k in options.symbols)
		{
			if (options.symbols.hasOwnProperty(k))
			{
				var s = options.symbols[k];
				if (s.indexOf("|") == -1)
				{
					s += "|" + options.range;
				}
				symbols.push([k, s]);
			}
		}
		var chartWidgetOptions = {
			container_id: "dijky-stock-chart-widget",
			width: "100%",
			height: options.bigmode ? "500px" : ((210+symbols.length*31) + "px"),
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
	
		console.log(">> dijky/reddit.com/amd_stock_chart_widget is active");

		var targetNode = document.getElementsByClassName("side")[0];
		var nextNode = targetNode.getElementsByClassName("spacer")[4];
		
		var chartNode = document.createElement("div");
		chartNode.id = "dijky-stock-chart-widget";
		chartNode.classList.add("spacer");
		chartNode.style.width = "100%";
		targetNode.insertBefore(chartNode, nextNode);
		
		var scriptNode = document.createElement("script");
		scriptNode.setAttribute("type", "text/javascript");
		document.head.appendChild(scriptNode);
		
		scriptNode.onload = function()
		{
			// console.log("TradingView JS loaded");
			// Create widget
			var chartWidget;
			if (options.bigmode)
			{
			    chartWidget = new TradingView.MediumWidget(chartWidgetOptions);
			}
			else
			{
					chartWidget = new TradingView.MiniWidget(chartWidgetOptions);
			}
		}
		scriptNode.setAttribute("src", "https://s3.amazonaws.com/tradingview/tv.js");
	}

	function handler()
	{
		run(document, window);
	}

	window.addEventListener("load", handler);
})(document, window, {
	// Configuration
	bigmode: false, // Enable big mode: true or false
	range: "3m",    // Chart range for all symbols: 1d, 1m, 3m, 1y, 5y
	symbols: {
		// List of symbols in the format
		// "display name": "symbol name",
		"AMD": "NASDAQ:AMD",
		// "AMD 1y": "NASDAQ:AMD|1y", // You can override the chart range with |1d or |1y etc
		"Intel": "NASDAQ:INTC",
		"Nvidia": "NASDAQ:NVDA",
		// "SOXX": "NASDAQ:SOXX",
		// "NASDAQ Comp": "NASX",
	}
});
