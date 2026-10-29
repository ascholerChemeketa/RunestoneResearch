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
    <!-- Filenames and order match _runestone_debug_service_info() in pretext.py.
         Managed external assets are published from assets/ to external/. -->
    <script src="{$external-directory}custom-runestone/prefix-runtime.bundle.js"></script>
    <script src="{$external-directory}custom-runestone/prefix-runtime-libs.bundle.js"></script>
    <script src="{$external-directory}custom-runestone/prefix-runestone.bundle.js"></script>
    <link rel="stylesheet" type="text/css" href="{$external-directory}custom-runestone/prefix-runtime-libs.css" />
    <link rel="stylesheet" type="text/css" href="{$external-directory}custom-runestone/prefix-runestone.css" />
  </xsl:template>

  <!-- The iframe's header-libraries hook runs before the authored scripts. -->
  <xsl:template match="interactive[@platform = 'javascript'][@custom-runestone = 'yes']" mode="header-libraries">
    <!-- Runestone externalizes jQuery; the minimal iframe head omits it. -->
    <script src="{$html.js.root}/jquery.min.js"></script>
    <xsl:call-template name="custom-runestone-header" />
    <xsl:apply-imports />
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
