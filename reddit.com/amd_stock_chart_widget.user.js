// ==UserScript==
// @name        AMD Stock Chart Widget
// @namespace   https://github.com/dijky/userscripts/reddit.com
// @description Add a stock chart widget to the sidebar of AMD subreddits. Widget powered by TradingView.com
// @downloadURL	https://github.com/Dijky/userscripts/raw/master/reddit.com/amd_stock_chart_widget.user.js
// @include     /^https?://\w+\.reddit\.com/r/Amd/.*$/
// @include     /^https?://\w+\.reddit\.com/r/AMD_Stock/.*$/
// @version     1
// @grant       none
// ==/UserScript==

function payload(document, window)
{
	console.log(">> dijky.reddit.stockChart is active");

	var targetNode = document.getElementsByClassName("side")[0];
	var nextNode = targetNode.getElementsByClassName("spacer")[3];
	
	var chartNode = document.createElement("div");
	chartNode.id = "dijky-stock-chart-widget";
	chartNode.classList.add("spacer");
	chartNode.style.width = "100%";
	targetNode.insertBefore(chartNode, nextNode);
	
	var orange = "rgba(241, 79, 37, 1)";
	
	var chartWidgetOptions = {
		container_id: "dijky-stock-chart-widget",
		width: "100%",
		tabs: [ "Stock" ],
		symbols: {
			"Stock": ["AMD", "Nvidia", "Intel"]
		},
		symbols_description: {
			"AMD": "NASDAQ:AMD",
			"Nvidia": "NASDAQ:NVDA",
			"Intel": "NASDAQ:INTC"
		},
		fontColor: orange,
		trendLineColor: orange,
		underLineColor: "rgba(241, 79, 37, 0.08)",
		activeTickerBackgroundColor: "rgba(241, 79, 37, 0.4)",
		styleTabActiveBorderColor: orange,
		styleTickerSymbolColor: "#000000",
		styleTickerChangeUpColor: "",
		// styleTickerChangeDownColor: "#000000", 
		styleWidgetNoBorder: true
	};
	
	var scriptNode = document.createElement("script");
	scriptNode.setAttribute("type", "text/javascript");
	document.head.appendChild(scriptNode);
	
	scriptNode.onload = function()
	{
		// console.log("TradingView JS loaded");
		// Create widget
		var chartWidget = new TradingView.MiniWidget(chartWidgetOptions);
	}
	scriptNode.setAttribute("src", "https://s3.amazonaws.com/tradingview/tv.js");
}

function handler()
{
	payload(document, window);
}

window.addEventListener("load", handler);
