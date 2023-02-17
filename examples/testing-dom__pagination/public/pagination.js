/* eslint-disable */

/*
 * pagination.js 2.1.4
 * A jQuery plugin to provide simple yet fully customisable pagination.
 * https://github.com/superRaytin/paginationjs
 *
 * Homepage: http://pagination.js.org
 *
 * Copyright 2014-2100, superRaytin
 * Released under the MIT license.
 */

(function (global, $) {
  if (typeof $ === 'undefined') {
    throwError('Pagination requires jQuery.')
  }

  let pluginName = 'pagination'

  let pluginHookMethod = 'addHook'

  let eventPrefix = '__pagination-'

  // Conflict, use backup
  if ($.fn.pagination) {
    pluginName = 'pagination2'
  }

  $.fn[pluginName] = function (options) {
    if (typeof options === 'undefined') {
      return this
    }

    let container = $(this)

    let attributes = $.extend({}, $.fn[pluginName].defaults, options)

    let pagination = {

      initialize () {
        let self = this

        // Cache attributes of current instance
        if (!container.data('pagination')) {
          container.data('pagination', {})
        }

        if (self.callHook('beforeInit') === false) return

        // Pagination has been initialized, destroy it
        if (container.data('pagination').initialized) {
          $('.paginationjs', container).remove()
        }

        // Whether to disable Pagination at the initialization
        self.disabled = !!attributes.disabled

        // Model will be passed to the callback function
        let model = self.model = {
          pageRange: attributes.pageRange,
          pageSize: attributes.pageSize,
        }

        // dataSource`s type is unknown, parse it to find true data
        self.parseDataSource(attributes.dataSource, function (dataSource) {
          // Currently in asynchronous mode
          self.isAsync = Helpers.isString(dataSource)
          if (Helpers.isArray(dataSource)) {
            model.totalNumber = attributes.totalNumber = dataSource.length
          }

          // Currently in asynchronous mode and a totalNumberLocator is specified
          self.isDynamicTotalNumber = self.isAsync && attributes.totalNumberLocator

          let el = self.render(true)

          // Add extra className to the pagination element
          if (attributes.className) {
            el.addClass(attributes.className)
          }

          model.el = el

          // Append/prepend pagination element to the container
          container[attributes.position === 'bottom' ? 'append' : 'prepend'](el)

          // Bind events
          self.observer()

          // Pagination is currently initialized
          container.data('pagination').initialized = true

          // Will be invoked after initialized
          self.callHook('afterInit', el)
        })
      },

      render (isBoot) {
        let self = this
        let model = self.model
        let el = model.el || $('<div class="paginationjs"></div>')
        let isForced = isBoot !== true

        self.callHook('beforeRender', isForced)

        let currentPage = model.pageNumber || attributes.pageNumber
        let pageRange = attributes.pageRange || 0
        let totalPage = self.getTotalPage()

        let rangeStart = currentPage - pageRange
        let rangeEnd = currentPage + pageRange

        if (rangeEnd > totalPage) {
          rangeEnd = totalPage
          rangeStart = totalPage - pageRange * 2
          rangeStart = rangeStart < 1 ? 1 : rangeStart
        }

        if (rangeStart <= 1) {
          rangeStart = 1
          rangeEnd = Math.min(pageRange * 2 + 1, totalPage)
        }

        el.html(self.generateHTML({
          currentPage,
          pageRange,
          rangeStart,
          rangeEnd,
        }))

        // There is only one page
        if (attributes.hideWhenLessThanOnePage) {
          el[totalPage <= 1 ? 'hide' : 'show']()
        }

        self.callHook('afterRender', isForced)

        return el
      },

      // Generate HTML of the pages
      generatePageNumbersHTML (args) {
        let self = this
        let currentPage = args.currentPage
        let totalPage = self.getTotalPage()
        let rangeStart = args.rangeStart
        let rangeEnd = args.rangeEnd
        let html = ''
        let i

        let pageLink = attributes.pageLink
        let ellipsisText = attributes.ellipsisText

        let classPrefix = attributes.classPrefix
        let activeClassName = attributes.activeClassName
        let disableClassName = attributes.disableClassName

        // Disable page range, display all the pages
        if (attributes.pageRange === null) {
          for (i = 1; i <= totalPage; i++) {
            if (i == currentPage) {
              html += `<li class="${classPrefix}-page J-paginationjs-page ${activeClassName}" data-num="${i}"><a>${i}<\/a><\/li>`
            } else {
              html += `<li class="${classPrefix}-page J-paginationjs-page" data-num="${i}"><a href="${pageLink}">${i}<\/a><\/li>`
            }
          }

          return html
        }

        if (rangeStart <= 3) {
          for (i = 1; i < rangeStart; i++) {
            if (i == currentPage) {
              html += `<li class="${classPrefix}-page J-paginationjs-page ${activeClassName}" data-num="${i}"><a>${i}<\/a><\/li>`
            } else {
              html += `<li class="${classPrefix}-page J-paginationjs-page" data-num="${i}"><a href="${pageLink}">${i}<\/a><\/li>`
            }
          }
        } else {
          if (attributes.showFirstOnEllipsisShow) {
            html += `<li class="${classPrefix}-page ${classPrefix}-first J-paginationjs-page" data-num="1"><a href="${pageLink}">1<\/a><\/li>`
          }

          html += `<li class="${classPrefix}-ellipsis ${disableClassName}"><a>${ellipsisText}<\/a><\/li>`
        }

        for (i = rangeStart; i <= rangeEnd; i++) {
          if (i == currentPage) {
            html += `<li class="${classPrefix}-page J-paginationjs-page ${activeClassName}" data-num="${i}"><a>${i}<\/a><\/li>`
          } else {
            html += `<li class="${classPrefix}-page J-paginationjs-page" data-num="${i}"><a href="${pageLink}">${i}<\/a><\/li>`
          }
        }

        if (rangeEnd >= totalPage - 2) {
          for (i = rangeEnd + 1; i <= totalPage; i++) {
            html += `<li class="${classPrefix}-page J-paginationjs-page" data-num="${i}"><a href="${pageLink}">${i}<\/a><\/li>`
          }
        } else {
          html += `<li class="${classPrefix}-ellipsis ${disableClassName}"><a>${ellipsisText}<\/a><\/li>`

          if (attributes.showLastOnEllipsisShow) {
            html += `<li class="${classPrefix}-page ${classPrefix}-last J-paginationjs-page" data-num="${totalPage}"><a href="${pageLink}">${totalPage}<\/a><\/li>`
          }
        }

        return html
      },

      // Generate HTML content from the template
      generateHTML (args) {
        let self = this
        let currentPage = args.currentPage
        let totalPage = self.getTotalPage()

        let totalNumber = self.getTotalNumber()

        let showPrevious = attributes.showPrevious
        let showNext = attributes.showNext
        let showPageNumbers = attributes.showPageNumbers
        let showNavigator = attributes.showNavigator
        let showGoInput = attributes.showGoInput
        let showGoButton = attributes.showGoButton

        let pageLink = attributes.pageLink
        let prevText = attributes.prevText
        let nextText = attributes.nextText
        let goButtonText = attributes.goButtonText

        let classPrefix = attributes.classPrefix
        let disableClassName = attributes.disableClassName
        let ulClassName = attributes.ulClassName

        let html = ''
        let goInput = '<input type="text" class="J-paginationjs-go-pagenumber">'
        let goButton = `<input type="button" class="J-paginationjs-go-button" value="${goButtonText}">`
        let formattedString

        let formatNavigator = $.isFunction(attributes.formatNavigator) ? attributes.formatNavigator(currentPage, totalPage, totalNumber) : attributes.formatNavigator
        let formatGoInput = $.isFunction(attributes.formatGoInput) ? attributes.formatGoInput(goInput, currentPage, totalPage, totalNumber) : attributes.formatGoInput
        let formatGoButton = $.isFunction(attributes.formatGoButton) ? attributes.formatGoButton(goButton, currentPage, totalPage, totalNumber) : attributes.formatGoButton

        let autoHidePrevious = $.isFunction(attributes.autoHidePrevious) ? attributes.autoHidePrevious() : attributes.autoHidePrevious
        let autoHideNext = $.isFunction(attributes.autoHideNext) ? attributes.autoHideNext() : attributes.autoHideNext

        let header = $.isFunction(attributes.header) ? attributes.header(currentPage, totalPage, totalNumber) : attributes.header
        let footer = $.isFunction(attributes.footer) ? attributes.footer(currentPage, totalPage, totalNumber) : attributes.footer

        // Whether to display header
        if (header) {
          formattedString = self.replaceVariables(header, {
            currentPage,
            totalPage,
            totalNumber,
          })

          html += formattedString
        }

        if (showPrevious || showPageNumbers || showNext) {
          html += '<div class="paginationjs-pages">'

          if (ulClassName) {
            html += `<ul class="${ulClassName}">`
          } else {
            html += '<ul>'
          }

          // Whether to display the Previous button
          if (showPrevious) {
            if (currentPage <= 1) {
              if (!autoHidePrevious) {
                html += `<li class="${classPrefix}-prev ${disableClassName}"><a>${prevText}<\/a><\/li>`
              }
            } else {
              html += `<li class="${classPrefix}-prev J-paginationjs-previous" data-num="${currentPage - 1}" title="Previous page"><a href="${pageLink}">${prevText}<\/a><\/li>`
            }
          }

          // Whether to display the pages
          if (showPageNumbers) {
            html += self.generatePageNumbersHTML(args)
          }

          // Whether to display the Next button
          if (showNext) {
            if (currentPage >= totalPage) {
              if (!autoHideNext) {
                html += `<li class="${classPrefix}-next ${disableClassName}"><a>${nextText}<\/a><\/li>`
              }
            } else {
              html += `<li class="${classPrefix}-next J-paginationjs-next" data-num="${currentPage + 1}" title="Next page"><a href="${pageLink}">${nextText}<\/a><\/li>`
            }
          }

          html += '<\/ul><\/div>'
        }

        // Whether to display the navigator
        if (showNavigator) {
          if (formatNavigator) {
            formattedString = self.replaceVariables(formatNavigator, {
              currentPage,
              totalPage,
              totalNumber,
            })

            html += `<div class="${classPrefix}-nav J-paginationjs-nav">${formattedString}<\/div>`
          }
        }

        // Whether to display the Go input
        if (showGoInput) {
          if (formatGoInput) {
            formattedString = self.replaceVariables(formatGoInput, {
              currentPage,
              totalPage,
              totalNumber,
              input: goInput,
            })

            html += `<div class="${classPrefix}-go-input">${formattedString}</div>`
          }
        }

        // Whether to display the Go button
        if (showGoButton) {
          if (formatGoButton) {
            formattedString = self.replaceVariables(formatGoButton, {
              currentPage,
              totalPage,
              totalNumber,
              button: goButton,
            })

            html += `<div class="${classPrefix}-go-button">${formattedString}</div>`
          }
        }

        // Whether to display footer
        if (footer) {
          formattedString = self.replaceVariables(footer, {
            currentPage,
            totalPage,
            totalNumber,
          })

          html += formattedString
        }

        return html
      },

      // Find totalNumber from the remote response
      // Only available in asynchronous mode
      findTotalNumberFromRemoteResponse (response) {
        let self = this

        self.model.totalNumber = attributes.totalNumberLocator(response)
      },

      // Go to the specified page
      go (number, callback) {
        let self = this
        let model = self.model

        if (self.disabled) return

        let pageNumber = number

        pageNumber = parseInt(pageNumber)

        // Page number is out of bounds
        if (!pageNumber || pageNumber < 1) return

        let pageSize = attributes.pageSize
        let totalNumber = self.getTotalNumber()
        let totalPage = self.getTotalPage()

        // Page number is out of bounds
        if (totalNumber > 0) {
          if (pageNumber > totalPage) return
        }

        // Pick data fragment in synchronous mode
        if (!self.isAsync) {
          render(self.getDataFragment(pageNumber))

          return
        }

        let postData = {}
        let alias = attributes.alias || {}

        postData[alias.pageSize ? alias.pageSize : 'pageSize'] = pageSize
        postData[alias.pageNumber ? alias.pageNumber : 'pageNumber'] = pageNumber

        let ajaxParams = $.isFunction(attributes.ajax) ? attributes.ajax() : attributes.ajax
        let formatAjaxParams = {
          type: 'get',
          cache: false,
          data: {},
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          dataType: 'json',
          async: true,
        }

        $.extend(true, formatAjaxParams, ajaxParams)
        $.extend(formatAjaxParams.data, postData)

        formatAjaxParams.url = attributes.dataSource
        formatAjaxParams.success = function (response) {
          if (self.isDynamicTotalNumber) {
            self.findTotalNumberFromRemoteResponse(response)
          } else {
            self.model.totalNumber = attributes.totalNumber
          }

          let finalData = self.filterDataByLocator(response)

          render(finalData)
        }

        formatAjaxParams.error = function (jqXHR, textStatus, errorThrown) {
          attributes.formatAjaxError && attributes.formatAjaxError(jqXHR, textStatus, errorThrown)
          self.enable()
        }

        self.disable()

        $.ajax(formatAjaxParams)

        function render (data) {
          // Will be invoked before paging
          if (self.callHook('beforePaging', pageNumber) === false) return false

          // Pagination direction
          model.direction = typeof model.pageNumber === 'undefined' ? 0 : (pageNumber > model.pageNumber ? 1 : -1)

          model.pageNumber = pageNumber

          self.render()

          if (self.disabled && self.isAsync) {
            // enable pagination
            self.enable()
          }

          // cache model data
          container.data('pagination').model = model

          // format result data before callback invoked
          if (attributes.formatResult) {
            let cloneData = $.extend(true, [], data)

            if (!Helpers.isArray(data = attributes.formatResult(cloneData))) {
              data = cloneData
            }
          }

          container.data('pagination').currentPageData = data

          // invoke callback
          self.doCallback(data, callback)

          self.callHook('afterPaging', pageNumber)

          // pageNumber now is the first page
          if (pageNumber == 1) {
            self.callHook('afterIsFirstPage')
          }

          // pageNumber now is the last page
          if (pageNumber == self.getTotalPage()) {
            self.callHook('afterIsLastPage')
          }
        }
      },

      doCallback (data, customCallback) {
        let self = this
        let model = self.model

        if ($.isFunction(customCallback)) {
          customCallback(data, model)
        } else if ($.isFunction(attributes.callback)) {
          attributes.callback(data, model)
        }
      },

      destroy () {
        // Before destroy
        if (this.callHook('beforeDestroy') === false) return

        this.model.el.remove()
        container.off()

        // Remove style element
        $('#paginationjs-style').remove()

        // After destroyed
        this.callHook('afterDestroy')
      },

      previous (callback) {
        this.go(this.model.pageNumber - 1, callback)
      },

      next (callback) {
        this.go(this.model.pageNumber + 1, callback)
      },

      disable () {
        let self = this
        let source = self.isAsync ? 'async' : 'sync'

        // Before disabled
        if (self.callHook('beforeDisable', source) === false) return

        self.disabled = true
        self.model.disabled = true

        // After disabled
        self.callHook('afterDisable', source)
      },

      enable () {
        let self = this
        let source = self.isAsync ? 'async' : 'sync'

        // Before enabled
        if (self.callHook('beforeEnable', source) === false) return

        self.disabled = false
        self.model.disabled = false

        // After enabled
        self.callHook('afterEnable', source)
      },

      refresh (callback) {
        this.go(this.model.pageNumber, callback)
      },

      show () {
        let self = this

        if (self.model.el.is(':visible')) return

        self.model.el.show()
      },

      hide () {
        let self = this

        if (!self.model.el.is(':visible')) return

        self.model.el.hide()
      },

      // Parse variables in the template
      replaceVariables (template, variables) {
        let formattedString

        for (let key in variables) {
          let value = variables[key]
          let regexp = new RegExp(`<%=\\s*${key}\\s*%>`, 'img')

          formattedString = (formattedString || template).replace(regexp, value)
        }

        return formattedString
      },

      // Get data fragment
      getDataFragment (number) {
        let pageSize = attributes.pageSize
        let dataSource = attributes.dataSource
        let totalNumber = this.getTotalNumber()

        let start = pageSize * (number - 1) + 1
        let end = Math.min(number * pageSize, totalNumber)

        return dataSource.slice(start - 1, end)
      },

      // Get total number
      getTotalNumber () {
        return this.model.totalNumber || attributes.totalNumber || 0
      },

      // Get total page
      getTotalPage () {
        return Math.ceil(this.getTotalNumber() / attributes.pageSize)
      },

      // Get locator
      getLocator (locator) {
        let result

        if (typeof locator === 'string') {
          result = locator
        } else if ($.isFunction(locator)) {
          result = locator()
        } else {
          throwError('"locator" is incorrect. (String | Function)')
        }

        return result
      },

      // Filter data by "locator"
      filterDataByLocator (dataSource) {
        let locator = this.getLocator(attributes.locator)
        let filteredData

        // Datasource is an Object, use "locator" to locate the true data
        if (Helpers.isObject(dataSource)) {
          try {
            $.each(locator.split('.'), function (index, item) {
              filteredData = (filteredData ? filteredData : dataSource)[item]
            })
          } catch (e) {
          }

          if (!filteredData) {
            throwError(`dataSource.${locator} is undefined.`)
          } else if (!Helpers.isArray(filteredData)) {
            throwError(`dataSource.${locator} must be an Array.`)
          }
        }

        return filteredData || dataSource
      },

      // Parse dataSource
      parseDataSource (dataSource, callback) {
        let self = this

        if (Helpers.isObject(dataSource)) {
          callback(attributes.dataSource = self.filterDataByLocator(dataSource))
        } else if (Helpers.isArray(dataSource)) {
          callback(attributes.dataSource = dataSource)
        } else if ($.isFunction(dataSource)) {
          attributes.dataSource(function (data) {
            if (!Helpers.isArray(data)) {
              throwError('The parameter of "done" Function should be an Array.')
            }

            self.parseDataSource.call(self, data, callback)
          })
        } else if (typeof dataSource === 'string') {
          if (/^https?|file:/.test(dataSource)) {
            attributes.ajaxDataType = 'jsonp'
          }

          callback(dataSource)
        } else {
          throwError('Unexpected type of "dataSource".')
        }
      },

      callHook (hook) {
        let paginationData = container.data('pagination')
        let result

        let args = Array.prototype.slice.apply(arguments)

        args.shift()

        if (attributes[hook] && $.isFunction(attributes[hook])) {
          if (attributes[hook].apply(global, args) === false) {
            result = false
          }
        }

        if (paginationData.hooks && paginationData.hooks[hook]) {
          $.each(paginationData.hooks[hook], function (index, item) {
            if (item.apply(global, args) === false) {
              result = false
            }
          })
        }

        return result !== false
      },

      observer () {
        let self = this
        let el = self.model.el

        // Go to specified page number
        container.on(`${eventPrefix}go`, function (event, pageNumber, done) {
          pageNumber = parseInt($.trim(pageNumber))

          if (!pageNumber) return

          if (!$.isNumeric(pageNumber)) {
            throwError('"pageNumber" is incorrect. (Number)')
          }

          self.go(pageNumber, done)
        })

        // Page number button click
        el.delegate('.J-paginationjs-page', 'click', function (event) {
          let current = $(event.currentTarget)
          let pageNumber = $.trim(current.attr('data-num'))

          if (!pageNumber || current.hasClass(attributes.disableClassName) || current.hasClass(attributes.activeClassName)) return

          // Before page button clicked
          if (self.callHook('beforePageOnClick', event, pageNumber) === false) return false

          self.go(pageNumber)

          // After page button clicked
          self.callHook('afterPageOnClick', event, pageNumber)

          if (!attributes.pageLink) return false
        })

        // Previous button click
        el.delegate('.J-paginationjs-previous', 'click', function (event) {
          let current = $(event.currentTarget)
          let pageNumber = $.trim(current.attr('data-num'))

          if (!pageNumber || current.hasClass(attributes.disableClassName)) return

          // Before previous clicked
          if (self.callHook('beforePreviousOnClick', event, pageNumber) === false) return false

          self.go(pageNumber)

          // After previous clicked
          self.callHook('afterPreviousOnClick', event, pageNumber)

          if (!attributes.pageLink) return false
        })

        // Next button click
        el.delegate('.J-paginationjs-next', 'click', function (event) {
          let current = $(event.currentTarget)
          let pageNumber = $.trim(current.attr('data-num'))

          if (!pageNumber || current.hasClass(attributes.disableClassName)) return

          // Before next clicked
          if (self.callHook('beforeNextOnClick', event, pageNumber) === false) return false

          self.go(pageNumber)

          // After next clicked
          self.callHook('afterNextOnClick', event, pageNumber)

          if (!attributes.pageLink) return false
        })

        // Go button click
        el.delegate('.J-paginationjs-go-button', 'click', function (event) {
          let pageNumber = $('.J-paginationjs-go-pagenumber', el).val()

          // Before Go button clicked
          if (self.callHook('beforeGoButtonOnClick', event, pageNumber) === false) return false

          container.trigger(`${eventPrefix}go`, pageNumber)

          // After Go button clicked
          self.callHook('afterGoButtonOnClick', event, pageNumber)
        })

        // go input enter
        el.delegate('.J-paginationjs-go-pagenumber', 'keyup', function (event) {
          if (event.which === 13) {
            let pageNumber = $(event.currentTarget).val()

            // Before Go input enter
            if (self.callHook('beforeGoInputOnEnter', event, pageNumber) === false) return false

            container.trigger(`${eventPrefix}go`, pageNumber)

            // Regains focus
            $('.J-paginationjs-go-pagenumber', el).focus()

            // After Go input enter
            self.callHook('afterGoInputOnEnter', event, pageNumber)
          }
        })

        // Previous page
        container.on(`${eventPrefix}previous`, function (event, done) {
          self.previous(done)
        })

        // Next page
        container.on(`${eventPrefix}next`, function (event, done) {
          self.next(done)
        })

        // Disable
        container.on(`${eventPrefix}disable`, function () {
          self.disable()
        })

        // Enable
        container.on(`${eventPrefix}enable`, function () {
          self.enable()
        })

        // Refresh
        container.on(`${eventPrefix}refresh`, function (event, done) {
          self.refresh(done)
        })

        // Show
        container.on(`${eventPrefix}show`, function () {
          self.show()
        })

        // Hide
        container.on(`${eventPrefix}hide`, function () {
          self.hide()
        })

        // Destroy
        container.on(`${eventPrefix}destroy`, function () {
          self.destroy()
        })

        // Whether to load the default page
        let validTotalPage = Math.max(self.getTotalPage(), 1)
        let defaultPageNumber = attributes.pageNumber

        // Default pageNumber should be 1 when totalNumber is dynamic
        if (self.isDynamicTotalNumber) {
          defaultPageNumber = 1
        }

        if (attributes.triggerPagingOnInit) {
          container.trigger(`${eventPrefix}go`, Math.min(defaultPageNumber, validTotalPage))
        }
      },
    }

    // Pagination has been initialized
    if (container.data('pagination') && container.data('pagination').initialized === true) {
      // Handle events
      if ($.isNumeric(options)) {
        // eg: container.pagination(5)
        container.trigger.call(this, `${eventPrefix}go`, options, arguments[1])

        return this
      }

      if (typeof options === 'string') {
        let args = Array.prototype.slice.apply(arguments)

        args[0] = eventPrefix + args[0]

        switch (options) {
          case 'previous':
          case 'next':
          case 'go':
          case 'disable':
          case 'enable':
          case 'refresh':
          case 'show':
          case 'hide':
          case 'destroy':
            container.trigger.apply(this, args)
            break
          // Get selected page number
          case 'getSelectedPageNum':
            if (container.data('pagination').model) {
              return container.data('pagination').model.pageNumber
            }

            return container.data('pagination').attributes.pageNumber

          // Get total page
          case 'getTotalPage':
            return Math.ceil(container.data('pagination').model.totalNumber / container.data('pagination').model.pageSize)
          // Get data of selected page
          case 'getSelectedPageData':
            return container.data('pagination').currentPageData
          // Whether pagination has been disabled
          case 'isDisabled':
            return container.data('pagination').model.disabled === true
          default:
            throwError(`Unknown action: ${options}`)
        }

        return this
      }

      // Uninstall the old instance before initializing a new one
      uninstallPlugin(container)
    } else {
      if (!Helpers.isObject(options)) throwError('Illegal options')
    }

    // Check parameters
    parameterChecker(attributes)

    pagination.initialize()

    return this
  }

  // Instance defaults
  $.fn[pluginName].defaults = {

    // Data source
    // Array | String | Function | Object
    //dataSource: '',

    // String | Function
    //locator: 'data',

    // Find totalNumber from remote response, the totalNumber will be ignored when totalNumberLocator is specified
    // Function
    //totalNumberLocator: function() {},

    // Total entries
    totalNumber: 0,

    // Default page
    pageNumber: 1,

    // entries of per page
    pageSize: 10,

    // Page range (pages on both sides of the current page)
    pageRange: 2,

    // Whether to display the 'Previous' button
    showPrevious: true,

    // Whether to display the 'Next' button
    showNext: true,

    // Whether to display the page buttons
    showPageNumbers: true,

    showNavigator: false,

    // Whether to display the 'Go' input
    showGoInput: false,

    // Whether to display the 'Go' button
    showGoButton: false,

    // Page link
    pageLink: '',

    // 'Previous' text
    prevText: '&laquo;',

    // 'Next' text
    nextText: '&raquo;',

    // Ellipsis text
    ellipsisText: '...',

    // 'Go' button text
    goButtonText: 'Go',

    // Additional className for Pagination element
    //className: '',

    classPrefix: 'paginationjs',

    // Default active class
    activeClassName: 'active',

    // Default disable class
    disableClassName: 'disabled',

    //ulClassName: '',

    // Whether to insert inline style
    inlineStyle: true,

    formatNavigator: '<%= currentPage %> / <%= totalPage %>',

    formatGoInput: '<%= input %>',

    formatGoButton: '<%= button %>',

    // Pagination element's position in the container
    position: 'bottom',

    // Auto hide previous button when current page is the first page
    autoHidePrevious: false,

    // Auto hide next button when current page is the last page
    autoHideNext: false,

    //header: '',

    //footer: '',

    // Aliases for custom pagination parameters
    //alias: {},

    // Whether to trigger pagination at initialization
    triggerPagingOnInit: true,

    // Whether to hide pagination when less than one page
    hideWhenLessThanOnePage: false,

    showFirstOnEllipsisShow: true,

    showLastOnEllipsisShow: true,

    // Pagination callback
    callback () {},
  }

  // Hook register
  $.fn[pluginHookMethod] = function (hook, callback) {
    if (arguments.length < 2) {
      throwError('Missing argument.')
    }

    if (!$.isFunction(callback)) {
      throwError('callback must be a function.')
    }

    let container = $(this)
    let paginationData = container.data('pagination')

    if (!paginationData) {
      container.data('pagination', {})
      paginationData = container.data('pagination')
    }

    !paginationData.hooks && (paginationData.hooks = {})

    //paginationData.hooks[hook] = callback;
    paginationData.hooks[hook] = paginationData.hooks[hook] || []
    paginationData.hooks[hook].push(callback)
  }

  // Static method
  $[pluginName] = function (selector, options) {
    if (arguments.length < 2) {
      throwError('Requires two parameters.')
    }

    let container

    // 'selector' is a jQuery object
    if (typeof selector !== 'string' && selector instanceof jQuery) {
      container = selector
    } else {
      container = $(selector)
    }

    if (!container.length) return

    container.pagination(options)

    return container
  }

  // ============================================================
  // helpers
  // ============================================================

  var Helpers = {}

  // Throw error
  function throwError (content) {
    throw new Error(`Pagination: ${content}`)
  }

  // Check parameters
  function parameterChecker (args) {
    if (!args.dataSource) {
      throwError('"dataSource" is required.')
    }

    if (typeof args.dataSource === 'string') {
      if (args.totalNumberLocator === undefined) {
        if (args.totalNumber === undefined) {
          throwError('"totalNumber" is required.')
        } else if (!$.isNumeric(args.totalNumber)) {
          throwError('"totalNumber" is incorrect. (Number)')
        }
      } else {
        if (!$.isFunction(args.totalNumberLocator)) {
          throwError('"totalNumberLocator" should be a Function.')
        }
      }
    } else if (Helpers.isObject(args.dataSource)) {
      if (typeof args.locator === 'undefined') {
        throwError('"dataSource" is an Object, please specify "locator".')
      } else if (typeof args.locator !== 'string' && !$.isFunction(args.locator)) {
        throwError(`${args.locator} is incorrect. (String | Function)`)
      }
    }

    if (args.formatResult !== undefined && !$.isFunction(args.formatResult)) {
      throwError('"formatResult" should be a Function.')
    }
  }

  // uninstall plugin
  function uninstallPlugin (target) {
    let events = ['go', 'previous', 'next', 'disable', 'enable', 'refresh', 'show', 'hide', 'destroy']

    // off events of old instance
    $.each(events, function (index, value) {
      target.off(eventPrefix + value)
    })

    // reset pagination data
    target.data('pagination', {})

    // remove old
    $('.paginationjs', target).remove()
  }

  // Object type detection
  function getObjectType (object, tmp) {
    return ((tmp = typeof (object)) == 'object' ? object == null && 'null' || Object.prototype.toString.call(object).slice(8, -1) : tmp).toLowerCase()
  }

  $.each(['Object', 'Array', 'String'], function (index, name) {
    Helpers[`is${name}`] = function (object) {
      return getObjectType(object) === name.toLowerCase()
    }
  })

  /*
   * export via AMD or CommonJS
   * */
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return $
    })
  }
})(this, window.jQuery)
