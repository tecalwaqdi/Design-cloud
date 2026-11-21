<?php
/**
 * Title: الرؤية والرسالة والقيم
 * Slug: roof-gulf/vision
 * Categories: roof-gulf, about
 */
$rg_v = array(
	array( 'target', 'رؤيتنا', 'أن نكون الخيار الأول في قطاع المقاولات بالخليج، بتقديم مشاريع تجمع الجودة والابتكار والاستدامة.' ),
	array( 'flag', 'رسالتنا', 'تنفيذ مشاريع عملائنا بأعلى معايير الجودة والسلامة، ضمن الوقت والميزانية، وبشراكة قائمة على الثقة.' ),
	array( 'handshake', 'قيمنا', 'النزاهة، الإتقان، الالتزام، العمل بروح الفريق، والمسؤولية تجاه عملائنا ومجتمعنا.' ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:columns {"align":"wide","className":"rg-cards","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"}}}} -->
<div class="wp-block-columns alignwide rg-cards"><?php foreach ( $rg_v as $rg_x ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"rg-card","style":{"border":{"radius":"16px","top":{"color":"var:preset|color|accent","width":"4px"}},"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"shadow":"var:preset|shadow|card"},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group rg-card has-base-background-color has-background" style="border-radius:16px;border-top-color:var(--wp--preset--color--accent);border-top-width:4px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--40);box-shadow:var(--wp--preset--shadow--card)"><!-- wp:html -->
<div class="rg-icon"><?php echo roof_gulf_icon( $rg_x[0] ); // phpcs:ignore ?></div>
<!-- /wp:html -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html( $rg_x[1] ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted"} -->
<p class="has-muted-color has-text-color"><?php echo esc_html( $rg_x[2] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
