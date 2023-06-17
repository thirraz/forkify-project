import * as model from "./model.js"
import { MODAL_CLOSE_SEC } from "./config.js"
import recipeView from "./views/recipeView.js"
import searchView from "./views/searchView.js"
import resultsView from "./views/resultsView.js"
import paginationView from "./views/paginationView.js"
import bookmarksView from "./views/bookmarksView.js"
import addRecipeView from "./views/addRecipeView.js"

import "core-js/stable"
import "regenerator-runtime/runtime"

const controlRecipes = async () => {
	try {
		const id = window.location.hash.slice(1)

		if (!id) return
		recipeView.renderSpinner()

		// 0) update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage())

		// 1) updating bookmarks view
		bookmarksView.update(model.state.bookmarks)

		// 2) loading recipe
		await model.loadRecipe(id)

		// 3) rendering recipe
		recipeView.render(model.state.recipe)
	} catch (err) {
		recipeView.renderError()
	}
}

const controlSearchResults = async () => {
	try {
		// 1) get search query
		const query = searchView.getQuery()
		if (!query) return

		resultsView.renderSpinner()
		// 2) load search results
		await model.loadSearchResults(query)

		// 3) render results
		// resultsView.render(model.state.search.results)
		resultsView.render(model.getSearchResultsPage())

		// 4) render initial pagination buttons
		paginationView.render(model.state.search)
	} catch (error) {
		console.log(error)
	}
}

const controlPagination = (goToPage) => {
	// 3) render NEW results
	resultsView.render(model.getSearchResultsPage(goToPage))

	// 4) render NEW initial pagination buttons
	paginationView.render(model.state.search)
}

const controlServings = (newServings) => {
	// update the recipe servings (in state)
	model.updateServings(newServings)

	// update the recipe view
	// recipeView.render(model.state.recipe)
	recipeView.update(model.state.recipe)
}

const controlAddBookmark = () => {
	// 1)  add/remove  bookmark
	if (!model.state.recipe.bookmarked) {
		model.addBookmark(model.state.recipe)
	} else {
		model.deleteBookmark(model.state.recipe.id)
	}

	// 2) update recipe view
	recipeView.update(model.state.recipe)

	// 3) render bookmarks
	bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
	bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async (newRecipe) => {
	try {
		// whow loading spinner
		addRecipeView.renderSpinner()

		// upload new recipe data
		await model.uploadRecipe(newRecipe)
		console.log(model.state.recipe)

		// render recipe
		recipeView.render(model.state.recipe)

		// sucess message
		addRecipeView.renderMessage()

		// render bookmark view
		bookmarksView.render(model.state.bookmarks)

		// change ID in URL
		window.history.pushState(null, "", `#${model.state.recipe.id}`)
		// window.history.back()

		// close form window
		setTimeout(function () {
			addRecipeView.toggleWindow()
		}, MODAL_CLOSE_SEC * 1000)
	} catch (error) {
		console.error("💥", error)
		addRecipeView.renderError(error.message)
	}
}

const init = () => {
	bookmarksView.addHandlerRender(controlBookmarks)
	recipeView.addHandlerRender(controlRecipes)
	recipeView.addHandlerUpdateServings(controlServings)
	recipeView.addHandlerAddBookmark(controlAddBookmark)
	searchView.addHandlerSearch(controlSearchResults)
	paginationView.addHandlerClick(controlPagination)
	addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
