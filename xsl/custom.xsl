<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exsl="http://exslt.org/common"
                extension-element-prefixes="exsl"
                version="1.0">
  <!-- The PreTeXt CLI supplies the core stylesheets alongside this file. -->
  <xsl:import href="./core/pretext-html.xsl" />

  <!-- Capture the upstream configuration and asset URLs so we can keep using
       PreTeXt's local/Runestone-hosted configuration without copying it. -->
  <xsl:variable name="standard-runestone-header">
    <xsl:call-template name="runestone-header" />
  </xsl:variable>

  <xsl:template name="custom-runestone-header">
    <xsl:copy-of select="exsl:node-set($standard-runestone-header)/script[not(@src)]" />
    <script type="text/javascript">eBookConfig.runestone_version = 'dev';</script>
    <!-- Filenames and order match the development bundle's static imports.
         Managed external assets are published from assets/ to external/. -->
    <script src="{$external-directory}custom-runestone/prefix-runtime.bundle.js"></script>
    <script src="{$external-directory}custom-runestone/prefix-runtime-libs.bundle.js"></script>
    <script src="{$external-directory}custom-runestone/prefix-runestone.bundle.js"></script>
    <link rel="stylesheet" type="text/css" href="{$external-directory}custom-runestone/prefix-runestone.css" />
  </xsl:template>

  <!-- The iframe's header-libraries hook runs before the authored scripts. -->
  <xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="header-libraries">
    <!-- Runestone externalizes jQuery; the minimal iframe head omits it. -->
    <script src="{$html.js.root}/jquery.min.js"></script>
    <xsl:call-template name="custom-runestone-header" />
    <xsl:apply-imports />
  </xsl:template>

  <!-- Use PreTeXt's existing responsive iframe sizing for every custom component. -->
  <xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="get-resize-behavior">responsive</xsl:template>

  <!-- A custom interactive has one Runestone identity.  A containing exercise
       owns it when present, just as it does for an ordinary ActiveCode. -->
  <xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="runestone-id">
    <xsl:choose>
      <xsl:when test="ancestor::exercise">
        <xsl:apply-templates select="ancestor::exercise[1]" mode="runestone-id" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="not(@label)">
          <xsl:message terminate="yes">A standalone custom Runestone interactive needs a label.</xsl:message>
        </xsl:if>
        <xsl:call-template name="runestone-label-prefix" />
        <xsl:value-of select="@label" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- The copied XHTML is an editable snapshot.  Only explicitly marked
       references to its question ID are rebound; unrelated local IDs stay. -->
  <xsl:template match="slate[@surface = 'html'][parent::interactive[@custom-runestone = 'yes']]">
    <xsl:if test="count(.//*[@data-component][not(ancestor::*[@data-component])]) != 1 or count(.//*[@data-component][not(ancestor::*[@data-component])][@id = '__RUNESTONE_ID__']) != 1">
      <xsl:message terminate="yes">A custom Runestone slate needs exactly one primary data-component root with id="__RUNESTONE_ID__".</xsl:message>
    </xsl:if>
    <xsl:variable name="question-id">
      <xsl:apply-templates select=".." mode="runestone-id" />
    </xsl:variable>
    <xsl:apply-templates select="*" mode="custom-runestone-copy">
      <xsl:with-param name="question-id" select="$question-id" />
    </xsl:apply-templates>
  </xsl:template>

  <xsl:template match="*" mode="custom-runestone-copy">
    <xsl:param name="question-id" />
    <xsl:element name="{local-name()}">
      <xsl:copy-of select="@*[namespace-uri(.) != 'http://pretextbook.org/2020/pretext/internal'][not(contains(., '__RUNESTONE_ID__'))]" />
      <xsl:for-each select="@*[namespace-uri(.) != 'http://pretextbook.org/2020/pretext/internal'][contains(., '__RUNESTONE_ID__')]">
        <xsl:attribute name="{name()}" namespace="{namespace-uri()}">
          <xsl:call-template name="custom-runestone-replace-id">
            <xsl:with-param name="value" select="." />
            <xsl:with-param name="question-id" select="$question-id" />
          </xsl:call-template>
        </xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates select="node()" mode="custom-runestone-copy">
        <xsl:with-param name="question-id" select="$question-id" />
      </xsl:apply-templates>
    </xsl:element>
  </xsl:template>

  <xsl:template match="text()" mode="custom-runestone-copy">
    <xsl:param name="question-id" />
    <xsl:call-template name="custom-runestone-replace-id">
      <xsl:with-param name="value" select="." />
      <xsl:with-param name="question-id" select="$question-id" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="comment()|processing-instruction()" mode="custom-runestone-copy">
    <xsl:copy />
  </xsl:template>

  <xsl:template name="custom-runestone-replace-id">
    <xsl:param name="value" />
    <xsl:param name="question-id" />
    <xsl:choose>
      <xsl:when test="contains($value, '__RUNESTONE_ID__')">
        <xsl:value-of select="substring-before($value, '__RUNESTONE_ID__')" />
        <xsl:value-of select="$question-id" />
        <xsl:call-template name="custom-runestone-replace-id">
          <xsl:with-param name="value" select="substring-after($value, '__RUNESTONE_ID__')" />
          <xsl:with-param name="question-id" select="$question-id" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$value" /></xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- The upstream section collector omits standalone JavaScript interactives.
       Keep its ordinary questions and add the opted-in ones. -->
  <xsl:template match="section[.//interactive[@platform = 'javascript'][@custom-runestone = 'yes']]" mode="runestone-manifest">
    <xsl:variable name="source" select="." />
    <xsl:variable name="standard"><xsl:apply-imports /></xsl:variable>
    <xsl:for-each select="exsl:node-set($standard)/subchapter">
      <xsl:copy>
        <xsl:copy-of select="@*|node()" />
        <xsl:apply-templates select="$source//interactive[@platform = 'javascript'][@custom-runestone = 'yes'][not(ancestor::exercise)]" mode="runestone-manifest" />
      </xsl:copy>
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="runestone-manifest">
    <question>
      <label><xsl:text>Interactive: </xsl:text><xsl:value-of select="@label" /></label>
      <htmlsrc><xsl:apply-templates select="slate[@surface = 'html']" /></htmlsrc>
    </question>
  </xsl:template>

  <!-- The enclosing exercise supplies the manifest label and question ID. -->
  <xsl:template match="exercise[statement//interactive[@platform = 'javascript'][@custom-runestone = 'yes']]" mode="runestone-manifest">
    <xsl:if test="count(statement//interactive[@custom-runestone = 'yes']) != 1">
      <xsl:message terminate="yes">A custom Runestone exercise needs exactly one opted-in interactive.</xsl:message>
    </xsl:if>
    <question>
      <xsl:apply-templates select="." mode="runestone-manifest-label" />
      <htmlsrc>
        <xsl:apply-templates select="statement/p" />
        <xsl:apply-templates select="statement//interactive[@custom-runestone = 'yes']/slate[@surface = 'html']" />
      </htmlsrc>
    </question>
    <xsl:apply-templates select="task" mode="runestone-manifest" />
  </xsl:template>

  <!-- Standalone heads are cached globally, so filter a copy for this page
       rather than changing the header shared by the rest of the book. -->
  <xsl:template match="node()" mode="custom-runestone-head">
    <xsl:copy-of select="." />
  </xsl:template>

  <xsl:template match="script[contains(., 'eBookConfig = {}')]" mode="custom-runestone-head">
    <xsl:call-template name="custom-runestone-header" />
  </xsl:template>

  <xsl:template match="script[@src]|link[@href]" mode="custom-runestone-head">
    <xsl:variable name="standard" select="exsl:node-set($standard-runestone-header)" />
    <xsl:if test="not(@src = $standard/script[contains(@src, '_static/')]/@src or @href = $standard/link/@href)">
      <xsl:copy-of select="." />
    </xsl:if>
  </xsl:template>

  <xsl:template match="interactive[@platform = 'javascript']" mode="create-iframe-page">
    <xsl:message>
      <xsl:text>rsResearch custom XSL: creating JavaScript interactive </xsl:text>
      <xsl:value-of select="@xml:id" />
    </xsl:message>
    <xsl:apply-imports />
  </xsl:template>
  <!-- Mirror the marked wrapper in PreTeXt's development stylesheet while
       this project builds from an installed core without that change.
       Adapted from xsl/pretext-html.xsl; copyright (C) 2013-2026
       Robert A. Beezer, GPL version 2 or later. -->
  <xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="create-iframe-page">
    <xsl:message>
      <xsl:text>rsResearch custom XSL: creating JavaScript interactive </xsl:text>
      <xsl:value-of select="@xml:id" />
    </xsl:message>
    <xsl:variable name="if-filename">
      <xsl:apply-templates select="." mode="iframe-filename" />
    </xsl:variable>
    <exsl:document href="{$if-filename}" method="html" indent="yes" encoding="UTF-8" doctype-system="about:legacy-compat">
      <xsl:call-template name="converter-blurb-html-no-date" />
      <html>
        <xsl:call-template name="language-attributes" />
        <head>
          <xsl:copy-of select="$file-wrap-iframe-head-cache" />
          <xsl:apply-templates select="@css" />
          <xsl:apply-templates select="." mode="header-libraries" />
        </head>
        <body class="ptx-content ignore-math">
          <xsl:call-template name="document-id" />
          <xsl:call-template name="react-in-use-flag" />
          <xsl:apply-templates select="." mode="latex-macros" />
          <xsl:if test="slate|sidebyside|sbsgroup">
            <div data-pretext-frame-resize="lti.frameResize">
              <xsl:attribute name="style">
                <xsl:text>aspect-ratio: </xsl:text>
                <xsl:apply-templates select="." mode="get-aspect-ratio" />
                <xsl:text>;</xsl:text>
              </xsl:attribute>
              <xsl:apply-templates select="slate|sidebyside|sbsgroup" />
            </div>
          </xsl:if>
          <xsl:apply-templates select="@source" />
          <xsl:apply-templates select="script" />
        </body>
      </html>
    </exsl:document>
  </xsl:template>
  <!-- Adapted from PreTeXt xsl/pretext-html.xsl's standalone-page template.
       The only behavior changes are the match and filtering the cached head.
       Copyright (C) 2013-2026  Robert A. Beezer
       Distributed under the GNU General Public License, version 2 or later. -->
<xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="standalone-page">
    <xsl:param name="content" select="''" />
    <xsl:variable name="filename">
        <xsl:apply-templates select="." mode="standalone-filename" />
    </xsl:variable>
    <exsl:document href="{$filename}" method="html" indent="yes" encoding="UTF-8" doctype-system="about:legacy-compat">
        <xsl:call-template name="converter-blurb-html-no-date"/>
        <html>
            <xsl:call-template name="language-attributes"/>
            <xsl:call-template name="pretext-advertisement-and-style"/>
            <!-- Open Graph Protocol only in "meta" elements, within "head" -->
            <head xmlns:og="http://ogp.me/ns#" xmlns:book="https://ogp.me/ns/book#">
                <title>
                    <!-- Leading with initials is useful for small tabs -->
                    <xsl:if test="$docinfo/initialism">
                        <xsl:apply-templates select="$docinfo/initialism" />
                        <xsl:text> </xsl:text>
                    </xsl:if>
                    <xsl:apply-templates select="." mode="title-plain" />
                </title>
                <!-- canonical link for better SEO -->
                <xsl:call-template name="canonical-link">
                    <xsl:with-param name="filename" select="$filename"/>
                </xsl:call-template>
                <!-- grab the contents every page gets -->
                <xsl:apply-templates select="exsl:node-set($file-wrap-basic-head-cache)/node()" mode="custom-runestone-head" />
                <!-- now do anything that is or could be page-specific and comes after cache -->
                <xsl:apply-templates select="." mode="knowl" />
            </head>
            <body>
                <!-- potential document-id per-page -->
                <xsl:call-template name="document-id"/>
                <!-- React flag -->
                <xsl:call-template name="react-in-use-flag"/>
                <!-- the first class controls the default icon -->
                <xsl:attribute name="class">
                    <xsl:choose>
                        <xsl:when test="$root/book">pretext book</xsl:when>
                        <xsl:when test="$root/article">pretext article</xsl:when>
                    </xsl:choose>
                    <!-- ignore MathJax signals everywhere, then enable selectively -->
                    <xsl:text> ignore-math</xsl:text>
                    <xsl:text> standalone-page</xsl:text>
                </xsl:attribute>
                <!-- assistive "Skip to main content" link    -->
                <!-- this *must* be first for maximum utility -->
                <xsl:call-template name="skip-to-content-link" />
                <xsl:apply-templates select="." mode="latex-macros" />
                <header id="ptx-masthead" class="ptx-masthead" role="banner">
                    <div class="ptx-banner">
                        <xsl:call-template name="brand-logo" />
                        <div class="title-container">
                            <div class="heading ptx-banner-heading">
                                <xsl:variable name="root-filename">
                                    <xsl:apply-templates select="$document-root" mode="containing-filename" />
                                </xsl:variable>
                                <a href="{$root-filename}">
                                    <xsl:variable name="b-has-subtitle" select="boolean($document-root/subtitle)"/>
                                    <span class="title">
                                        <!-- Do not use shorttitle in masthead,  -->
                                        <!-- which is much like cover of a book  -->
                                        <xsl:apply-templates select="$document-root" mode="title-simple" />
                                    </span>
                                    <xsl:if test="$b-has-subtitle and $b-html-banner-subtitle">
                                        <xsl:text> </xsl:text>
                                        <span class="subtitle">
                                            <xsl:apply-templates select="$document-root" mode="subtitle" />
                                        </span>
                                    </xsl:if>
                                </a>
                            </div>
                            <!-- Serial list of authors/editors -->
                            <xsl:if test="$b-html-banner-byline">
                                <p class="byline">
                                    <xsl:apply-templates select="$bibinfo/author" mode="name-list"/>
                                    <xsl:apply-templates select="$bibinfo/editor" mode="name-list"/>
                                </p>
                            </xsl:if>
                        </div>  <!-- title-container -->
                    </div> <!-- banner -->
                </header> <!-- masthead -->
                <div class="ptx-page">
                    <!-- With sidebars killed, this stuff is extraneous     -->
                    <!-- <xsl:apply-templates select="." mode="sidebars" /> -->
                    <main class="ptx-main">
                        <div id="ptx-content">
                            <!-- This is content passed in as a parameter -->
                            <xsl:copy-of select="$content" />
                        </div>
                    </main>
                </div>
                <xsl:copy-of select="$file-wrap-basic-endbody-cache"/>
            </body>
        </html>
    </exsl:document>
</xsl:template>
</xsl:stylesheet>
