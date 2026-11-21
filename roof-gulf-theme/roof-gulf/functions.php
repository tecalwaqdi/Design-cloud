<?php
/**
 * Roof Gulf theme functions.
 *
 * @package roof-gulf
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * بيانات التواصل — عدّلها هنا مرة واحدة وتتحدث في كل الموقع.
 */
function roof_gulf_contact( $key ) {
	$data = array(
		'phone'    => '+966 50 000 0000',
		'whatsapp' => '966500000000', // بدون + أو مسافات.
		'email'    => 'info@roof-gulf.com',
		'address'  => 'المملكة العربية السعودية — الرياض',
	);
	return isset( $data[ $key ] ) ? $data[ $key ] : '';
}

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'editor-styles' );
		add_editor_style( 'assets/css/theme.css' );
		load_theme_textdomain( 'roof-gulf', get_template_directory() . '/languages' );
	}
);

/**
 * الموقع عربي بالكامل: نفرض اتجاه RTL في الواجهة حتى لو كانت لغة الموقع غير العربية.
 */
add_action(
	'init',
	function () {
		global $wp_locale;
		if ( ! is_admin() && isset( $wp_locale ) && ! $wp_locale->is_rtl() ) {
			$wp_locale->text_direction = 'rtl';
		}
	}
);

add_filter(
	'language_attributes',
	function ( $output ) {
		if ( is_admin() ) {
			return $output;
		}
		return preg_replace( '/lang="[^"]*"/', 'lang="ar"', $output );
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		$ver = wp_get_theme()->get( 'Version' );
		wp_enqueue_style( 'roof-gulf', get_theme_file_uri( 'assets/css/theme.css' ), array(), $ver );
	}
);

add_action(
	'init',
	function () {
		register_block_pattern_category( 'roof-gulf', array( 'label' => 'سقف الخليج' ) );
	}
);

/**
 * زر واتساب عائم في كل الصفحات.
 */
add_action(
	'wp_footer',
	function () {
		$number = roof_gulf_contact( 'whatsapp' );
		if ( ! $number ) {
			return;
		}
		printf(
			'<a class="rg-whatsapp" href="%1$s" target="_blank" rel="noopener" aria-label="%2$s"><svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.9-1.8-6 0-5.9 4.9-10.7 11-10.7s11 4.8 11 10.7-4.9 10.9-11 10.9zm6-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 2.1.9 2.9.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg></a>',
			esc_url( 'https://wa.me/' . rawurlencode( $number ) ),
			esc_attr__( 'تواصل عبر واتساب', 'roof-gulf' )
		);
	}
);

/**
 * أيقونات SVG خطية مدمجة (بدون مكتبات خارجية).
 */
function roof_gulf_icon( $name, $size = 28 ) {
	$paths = array(
		'building' => '<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h.01M9 13h.01M9 17h.01"/>',
		'paint'    => '<path d="M19 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14"/><path d="M12 13v3"/><rect x="10" y="16" width="4" height="6" rx="1"/>',
		'tools'    => '<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L4 12l8-8z"/><path d="m2 22 5-5"/>',
		'bolt'     => '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
		'ruler'    => '<path d="M21.3 15.3 8.7 2.7a1 1 0 0 0-1.4 0L2.7 7.3a1 1 0 0 0 0 1.4l12.6 12.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="m7.5 10.5 2-2M10.5 13.5l2-2M13.5 16.5l2-2"/>',
		'road'     => '<path d="M4 21 8 3"/><path d="m20 21-4-18"/><path d="M12 5v2M12 11v2M12 17v2"/>',
		'target'   => '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
		'flag'     => '<path d="M4 22V4"/><path d="M4 4h12l-2 4 2 4H4"/>',
		'handshake'=> '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5 5 0 0 1 5.9-.8l.5.3a3 3 0 0 0 2 .4H21"/><path d="M21 3v11h-2"/><path d="M3 3v11h2l5 5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
		'phone'    => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
		'chat'     => '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/>',
		'mail'     => '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
		'pin'      => '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return sprintf(
		'<svg class="rg-svg" xmlns="http://www.w3.org/2000/svg" width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%2$s</svg>',
		(int) $size,
		$paths[ $name ]
	);
}
